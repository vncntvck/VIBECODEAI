require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const { pool, initDB } = require('./db');

const authRoutes  = require('./routes/auth');
const txRoutes    = require('./routes/transactions');
const gmailRoutes = require('./routes/gmail');
const userRoutes  = require('./routes/user');

const app  = express();
const PORT = process.env.PORT || 3000;

// Trust Railway reverse proxy
app.set('trust proxy', 1);

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow all origins and headers for JWT auth
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/transactions', txRoutes);
app.use('/api/gmail',        gmailRoutes);
app.use('/api/user',         userRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── Start ───────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Fintjam backend running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
