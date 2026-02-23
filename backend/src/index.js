/**
 * Digital Guardians API
 * Main entry point for the Express server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

// Import routes
const analyzeRoutes = require('./routes/analyze');
const tutorialsRoutes = require('./routes/tutorials');
const alertsRoutes = require('./routes/alerts');
const feedbackRoutes = require('./routes/feedback');
const glossaryRoutes = require('./routes/glossary');
const ttsRoutes = require('./routes/tts');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');

// Import middleware
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import database
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5500'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies
app.use(cookieParser());

// Request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      event: 'request',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: duration,
      request_id: req.id,
    });
  });
  
  next();
});

// ============================================================================
// RATE LIMITING
// ============================================================================

// Apply rate limiting to all requests
app.use(rateLimiter);

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// API routes
app.use('/v1/analyze', analyzeRoutes);
app.use('/v1/tutorials', tutorialsRoutes);
app.use('/v1/alerts', alertsRoutes);
app.use('/v1/feedback', feedbackRoutes);
app.use('/v1/glossary', glossaryRoutes);
app.use('/v1/tts', ttsRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/users', progressRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
    },
    meta: {
      request_id: req.id,
      timestamp: new Date().toISOString(),
    },
  });
});

// Global error handler
app.use(errorHandler);

// ============================================================================
// DATABASE & SERVER STARTUP
// ============================================================================

const startServer = async () => {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    logger.info('Database connected successfully');
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`Digital Guardians API running on port ${PORT}`);
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🛡️  Digital Guardians API                                  ║
║                                                              ║
║   Server running on: http://localhost:${PORT}                  ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Version: 1.0.0                                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

module.exports = app;
