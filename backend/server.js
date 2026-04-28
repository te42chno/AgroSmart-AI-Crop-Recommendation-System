require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
  console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables!');
}

// ── Middleware ─────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api', predictionRoutes);
app.use('/api/admin', adminRoutes);

// ── Error Handler ─────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  AgroSmart Backend running on http://localhost:${PORT}`);
    console.log(`  ML Service expected at ${process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000'}\n`);
  });
};

start();
