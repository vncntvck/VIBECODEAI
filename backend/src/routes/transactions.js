const router   = require('express').Router();
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/transactions — ambil semua transaksi user
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [req.session.userId]
    );
    res.json(result.rows.map(formatTx));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/transactions — tambah transaksi baru
router.post('/', requireAuth, async (req, res) => {
  const { type, amount, category, note, date, source } = req.body;
  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: 'type, amount, category, date wajib diisi' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, category, note, date, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.session.userId, type, amount, category, note || '', date, source || 'manual']
    );
    res.status(201).json(formatTx(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/transactions/:id — hapus transaksi
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.session.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper: format row DB → object frontend
function formatTx(row) {
  return {
    id:        row.id,
    userId:    row.user_id,
    type:      row.type,
    amount:    Number(row.amount),
    category:  row.category,
    note:      row.note,
    date:      row.date instanceof Date
                 ? row.date.toISOString().split('T')[0]
                 : row.date,
    source:    row.source,
    createdAt: row.created_at,
  };
}

module.exports = router;
