const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id           SERIAL PRIMARY KEY,
      username     VARCHAR(50) UNIQUE NOT NULL,
      password     TEXT NOT NULL,
      monthly_limit BIGINT DEFAULT 0,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type       VARCHAR(10) NOT NULL CHECK (type IN ('income','expense')),
      amount     BIGINT NOT NULL,
      category   VARCHAR(100) NOT NULL,
      note       TEXT DEFAULT '',
      date       DATE NOT NULL,
      source     VARCHAR(20) DEFAULT 'manual',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      sid    VARCHAR NOT NULL COLLATE "default",
      sess   JSON NOT NULL,
      expire TIMESTAMPTZ NOT NULL,
      CONSTRAINT session_pkey PRIMARY KEY (sid)
    );

    CREATE TABLE IF NOT EXISTS gmail_tokens (
      user_id       INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      access_token  TEXT,
      refresh_token TEXT NOT NULL,
      expiry_date   BIGINT,
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date    ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_sessions_expire      ON user_sessions(expire);
  `);
  console.log('Database initialized');
}

module.exports = { pool, initDB };
