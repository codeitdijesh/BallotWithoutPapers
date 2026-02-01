const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { pool } = require('./config/database');
const blockchainService = require('./services/blockchain');

// Import routes
const authRoutes = require('./routes/auth');
const electionRoutes = require('./routes/elections');
const voterRoutes = require('./routes/voters');

const app = express();
const PORT = process.env.PORT || 5000;

// ============ Middleware ============

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ============ Routes ============

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/voters', voterRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ============ Server Startup ============

async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');

    // Initialize blockchain service
    await blockchainService.initialize();
    console.log('✅ Blockchain service initialized');

    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('🗳️  Ballot Without Papers - API Server');
      console.log('='.repeat(50));
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log('');
      console.log('📚 Available endpoints:');
      console.log('   GET  /health');
      console.log('   POST /api/auth/login');
      console.log('   GET  /api/auth/profile');
      console.log('   POST /api/elections');
      console.log('   GET  /api/elections');
      console.log('   POST /api/voters/register');
      console.log('   GET  /api/voters/:election_id/pending');
      console.log('   POST /api/voters/:voter_id/approve');
      console.log('   POST /api/voters/:election_id/sync');
      console.log('');
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️  SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
