const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

// PUT /api/user/profile — update username, password, limit
router.put('/profile', requireAuth, async (req, res) => {
  const { username, password, monthlyLimit } = req.body;
  const userId = req.session.userId;

  try {
    // Cek username tidak bentrok dengan user lain
    if (username) {
      const check = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );
      if (check.rows.length > 0) return res.status(409).json({ error: 'Username sudah digunakan' });
    }

    let query, params;
    if (password) {
      const hash = await bcrypt.hash(password, 12);
      query  = 'UPDATE users SET username=$1, password=$2, monthly_limit=$3 WHERE id=$4 RETURNING id, username, monthly_limit';
      params = [username, hash, monthlyLimit ?? 0, userId];
    } else {
      query  = 'UPDATE users SET username=$1, monthly_limit=$2 WHERE id=$3 RETURNING id, username, monthly_limit';
      params = [username, monthlyLimit ?? 0, userId];
    }

    const result = await pool.query(query, params);
    const u = result.rows[0];
    res.json({ user: { id: u.id, username: u.username, monthlyLimit: u.monthly_limit } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
