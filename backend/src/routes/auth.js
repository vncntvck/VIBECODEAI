const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const { pool } = require('../db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username dan password wajib diisi' });
  if (password.length < 6) return res.status(400).json({ error: 'Password minimal 6 karakter' });

  try {
    const exists = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (exists.rows.length > 0) return res.status(409).json({ error: 'Username sudah digunakan' });

    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, monthly_limit',
      [username, hash]
    );
    const user = result.rows[0];
    req.session.userId = user.id;
    res.status(201).json({ user: { id: user.id, username: user.username, monthlyLimit: user.monthly_limit } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username dan password wajib diisi' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Username atau password salah' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Username atau password salah' });

    req.session.userId = user.id;
    res.json({ user: { id: user.id, username: user.username, monthlyLimit: user.monthly_limit } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await pool.query(
      'SELECT id, username, monthly_limit FROM users WHERE id = $1',
      [req.session.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const u = result.rows[0];
    res.json({ user: { id: u.id, username: u.username, monthlyLimit: u.monthly_limit } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
