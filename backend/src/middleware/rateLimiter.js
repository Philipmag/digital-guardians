/**
 * Rate limiting middleware
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_ANONYMOUS) || 10, // 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => {
    logger.warn({
      event: 'rate_limit_exceeded',
      ip: req.ip,
      path: req.path,
    });
    
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: "You've checked many messages recently. Please wait a minute.",
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

// Stricter rate limiter for analysis endpoint
const analyzeLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // 10 analyses per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: "You've checked many messages recently. Please wait a minute.",
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  },
});

// TTS rate limiter
const ttsLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 5, // 5 TTS requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: "Too many audio requests. Please wait a moment.",
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  },
});

module.exports = {
  apiLimiter,
  analyzeLimiter,
  ttsLimiter,
};
