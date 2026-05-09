const router      = require('express').Router();
const { google }  = require('googleapis');
const { pool }    = require('../db');
const { requireAuth } = require('../middleware/auth');
const { parseKromEmail } = require('../services/emailParser');

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// GET /api/gmail/connect — redirect ke Google OAuth
router.get('/connect', requireAuth, (req, res) => {
  const oauth2 = getOAuthClient();
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    state: req.session.userId.toString(),
  });
  res.json({ url });
});

// GET /api/gmail/callback — terima code dari Google
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const userId = parseInt(state);

  try {
    const oauth2 = getOAuthClient();
    const { tokens } = await oauth2.getToken(code);

    // Simpan token ke DB
    await pool.query(`
      INSERT INTO gmail_tokens (user_id, access_token, refresh_token, expiry_date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE
        SET access_token  = $2,
            refresh_token = COALESCE($3, gmail_tokens.refresh_token),
            expiry_date   = $4,
            updated_at    = NOW()
    `, [userId, tokens.access_token, tokens.refresh_token, tokens.expiry_date]);

    // Redirect ke frontend dengan sukses
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5500';
    res.redirect(`${frontendUrl}/settings.html?gmail=connected`);
  } catch (err) {
    console.error('Gmail callback error:', err);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5500';
    res.redirect(`${frontendUrl}/settings.html?gmail=error`);
  }
});

// GET /api/gmail/status — cek apakah Gmail sudah terhubung
router.get('/status', requireAuth, async (req, res) => {
  const result = await pool.query(
    'SELECT user_id, updated_at FROM gmail_tokens WHERE user_id = $1',
    [req.session.userId]
  );
  res.json({ connected: result.rows.length > 0, updatedAt: result.rows[0]?.updated_at });
});

// DELETE /api/gmail/disconnect — cabut koneksi Gmail
router.delete('/disconnect', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM gmail_tokens WHERE user_id = $1', [req.session.userId]);
  res.json({ ok: true });
});

// POST /api/gmail/sync — tarik email bank & parse jadi transaksi
router.post('/sync', requireAuth, async (req, res) => {
  const userId = req.session.userId;

  try {
    // Ambil token dari DB
    const tokenRow = await pool.query(
      'SELECT * FROM gmail_tokens WHERE user_id = $1',
      [userId]
    );
    if (tokenRow.rows.length === 0) {
      return res.status(400).json({ error: 'Gmail belum terhubung' });
    }

    const tokens = tokenRow.rows[0];
    const oauth2 = getOAuthClient();
    oauth2.setCredentials({
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date:   tokens.expiry_date,
    });

    // Auto-refresh token jika expired
    oauth2.on('tokens', async (newTokens) => {
      await pool.query(
        `UPDATE gmail_tokens SET access_token=$1, expiry_date=$2, updated_at=NOW() WHERE user_id=$3`,
        [newTokens.access_token, newTokens.expiry_date, userId]
      );
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2 });

    // Cari email dari Krom Bank (30 hari terakhir)
    const after = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: `from:(noreply@krom.id OR notification@krom.id OR info@krom.id) after:${after}`,
      maxResults: 50,
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) {
      return res.json({ imported: 0, message: 'Tidak ada email Krom Bank baru ditemukan' });
    }

    let imported = 0;
    let skipped  = 0;
    const results = [];

    for (const msg of messages) {
      // Ambil detail email
      const detail = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });

      // Ekstrak body email
      const body = extractEmailBody(detail.data);
      if (!body) { skipped++; continue; }

      // Parse jadi transaksi
      const tx = parseKromEmail(body, detail.data);
      if (!tx) { skipped++; continue; }

      // Cek duplikat berdasarkan tanggal + amount + type
      const dup = await pool.query(
        `SELECT id FROM transactions
         WHERE user_id=$1 AND date=$2 AND amount=$3 AND type=$4 AND source='gmail'`,
        [userId, tx.date, tx.amount, tx.type]
      );
      if (dup.rows.length > 0) { skipped++; continue; }

      // Simpan ke DB
      const saved = await pool.query(
        `INSERT INTO transactions (user_id, type, amount, category, note, date, source)
         VALUES ($1, $2, $3, $4, $5, $6, 'gmail') RETURNING *`,
        [userId, tx.type, tx.amount, tx.category, tx.note, tx.date]
      );
      results.push(saved.rows[0]);
      imported++;
    }

    res.json({
      imported,
      skipped,
      transactions: results.map(r => ({
        id: r.id, type: r.type, amount: Number(r.amount),
        category: r.category, note: r.note, date: r.date,
      })),
    });
  } catch (err) {
    console.error('Gmail sync error:', err);
    res.status(500).json({ error: 'Gagal sync Gmail: ' + err.message });
  }
});

// Helper: ekstrak plain text dari payload Gmail
function extractEmailBody(messageData) {
  const payload = messageData.payload;
  if (!payload) return null;

  function decode(data) {
    return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
  }

  // Single part
  if (payload.body?.data) return decode(payload.body.data);

  // Multipart — cari text/plain atau text/html
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) return decode(part.body.data);
    }
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        // Strip HTML tags
        return decode(part.body.data).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      }
    }
    // Nested multipart
    for (const part of payload.parts) {
      if (part.parts) {
        for (const sub of part.parts) {
          if (sub.mimeType === 'text/plain' && sub.body?.data) return decode(sub.body.data);
        }
      }
    }
  }
  return null;
}

module.exports = router;
