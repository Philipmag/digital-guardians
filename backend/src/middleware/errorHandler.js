/**
 * Global error handler middleware
 */

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    event: 'error',
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    request_id: req.id,
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details,
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication required.',
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  }

  if (err.code === '23505') {
    // PostgreSQL unique constraint violation
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'This already exists.',
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  }

  if (err.code === '23503') {
    // PostgreSQL foreign key violation
    return res.status(400).json({
      success: false,
      error: {
        code: 'REFERENCE_ERROR',
        message: 'Invalid reference.',
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Default server error
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: isProduction 
        ? 'Something went wrong. Please try again later.'
        : err.message,
    },
    meta: {
      request_id: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = errorHandler;
