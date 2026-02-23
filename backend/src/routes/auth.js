/**
 * Authentication API Routes
 * POST /v1/auth/register
 * POST /v1/auth/login
 * POST /v1/auth/logout
 * POST /v1/auth/refresh
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const logger = require('../utils/logger');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';
const REFRESH_EXPIRY_DAYS = 30;

/**
 * Generate tokens
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  const refreshToken = uuidv4();
  
  return { accessToken, refreshToken };
};

/**
 * POST /v1/auth/register
 * Create a new account
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
      });
    }

    const { email, password } = req.body;

    // Check if email exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_ERROR', message: 'Email already registered' },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at`,
      [email, passwordHash]
    );

    const user = result.rows[0];
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Store refresh token
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    });

    logger.info({ event: 'user_registered', userId: user.id });

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email },
        access_token: accessToken,
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/auth/login
 * Login with email/password
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid credentials' },
      });
    }

    const { email, password } = req.body;

    // Find user
    const result = await db.query(
      `SELECT id, email, password_hash, deleted_at FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_ERROR', message: 'Invalid email or password' },
      });
    }

    const user = result.rows[0];

    // Check if deleted
    if (user.deleted_at) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_ERROR', message: 'Account has been deleted' },
      });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_ERROR', message: 'Invalid email or password' },
      });
    }

    // Update last login
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Store refresh token
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    });

    logger.info({ event: 'user_login', userId: user.id });

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email },
        access_token: accessToken,
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/auth/logout
 * Logout and clear refresh token
 */
router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await db.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    }

    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully',
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_ERROR', message: 'No refresh token' },
      });
    }

    // Verify refresh token
    const result = await db.query(
      `SELECT rt.user_id, rt.expires_at, u.email 
       FROM refresh_tokens rt 
       JOIN users u ON rt.user_id = u.id 
       WHERE rt.token = $1 AND rt.expires_at > NOW()`,
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_ERROR', message: 'Invalid or expired refresh token' },
      });
    }

    const { user_id, email } = result.rows[0];

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user_id);

    // Delete old refresh token
    await db.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);

    // Store new refresh token
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user_id, newRefreshToken, expiresAt]
    );

    // Set new refresh token
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: { id: user_id, email },
        access_token: accessToken,
      },
      meta: {
        request_id: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
