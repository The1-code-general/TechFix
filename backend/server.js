require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;


// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);


// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// ─── Static Files (Uploads) ───────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', routes);


// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'TechFix API is running', timestamp: new Date() });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});


// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // Use seed.js (force:true) for schema changes
      console.log('✅ Database synced');
    }

    app.listen(PORT, () => {
      console.log(`🚀 TechFix API running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:');
    console.error(error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
