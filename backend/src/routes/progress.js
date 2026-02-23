/**
 * User Progress API Routes
 * GET /v1/users/me/progress
 * POST /v1/users/me/progress
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const logger = require('../utils/logger');

const router = express.Router();

// Middleware to get current user (simplified - in production use JWT)
const getCurrentUser = async (req, res, next) => {
  // For now, we'll use a simple session lookup
  // In production, this would verify JWT
  const sessionId = req.headers['x-session-id'] || req.cookies?.session_id;
  
  if (!sessionId) {
    // Return null for anonymous users
    req.userId = null;
    req.sessionId = null;
    return next();
  }

  try {
    const result = await db.query(
      `SELECT user_id FROM sessions WHERE id = $1 AND expires_at > NOW()`,
      [sessionId]
    );

    if (result.rows.length > 0) {
      req.userId = result.rows[0].user_id;
    }
    req.sessionId = sessionId;
  } catch (error) {
    logger.warn({ event: 'session_lookup_failed', error: error.message });
  }

  next();
};

router.use(getCurrentUser);

/**
 * GET /v1/users/me/progress
 * Get user's learning progress
 */
router.get('/me/progress', async (req, res, next) => {
  try {
    if (!req.userId && !req.sessionId) {
      return res.json({
        success: true,
        data: {
          tutorials_completed: [],
          tutorials_in_progress: [],
          quizzes_passed: [],
          badges_earned: [],
          total_learning_time_minutes: 0,
        },
      });
    }

    // Get progress
    let query = `
      SELECT up.*, t.title as tutorial_title, t.category
      FROM user_progress up
      JOIN tutorials t ON up.tutorial_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (req.userId) {
      query += ` AND up.user_id = $1`;
      params.push(req.userId);
    } else if (req.sessionId) {
      query += ` AND up.session_id = $1`;
      params.push(req.sessionId);
    }

    query += ` ORDER BY up.last_accessed_at DESC`;

    const result = await db.query(query, params);

    const tutorialsCompleted = [];
    const tutorialsInProgress = [];
    const quizzesPassed = [];

    for (const progress of result.rows) {
      if (progress.completed_at) {
        tutorialsCompleted.push(progress.tutorial_id);
      } else {
        tutorialsInProgress.push({
          tutorial_id: progress.tutorial_id,
          current_step: progress.current_step,
          total_steps: 0, // Would need to join to get this
          last_accessed: progress.last_accessed_at,
        });
      }

      if (progress.quiz_passed) {
        quizzesPassed.push(progress.tutorial_id);
      }
    }

    // Calculate total time
    const totalTime = result.rows.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0);

    res.json({
      success: true,
      data: {
        tutorials_completed: tutorialsCompleted,
        tutorials_in_progress: tutorialsInProgress,
        quizzes_passed: quizzesPassed,
        badges_earned: [], // Would implement badge system
        total_learning_time_minutes: Math.round(totalTime / 60),
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
 * POST /v1/users/me/progress
 * Update progress for a tutorial
 */
router.post('/me/progress', [
  body('tutorial_id').isString().notEmpty(),
  body('current_step').optional().isInt({ min: 1 }),
  body('completed').optional().isBoolean(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
      });
    }

    const { tutorial_id, current_step, completed, time_spent } = req.body;

    if (!req.userId && !req.sessionId) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_ERROR', message: 'Session required to save progress' },
      });
    }

    // Upsert progress
    const query = `
      INSERT INTO user_progress (user_id, session_id, tutorial_id, current_step, completed_at, time_spent_seconds, last_accessed_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (user_id, tutorial_id) 
        DO UPDATE SET 
          current_step = COALESCE($4, user_progress.current_step),
          completed_at = COALESCE($5, user_progress.completed_at),
          time_spent_seconds = user_progress.time_spent_seconds + COALESCE($6, 0),
          last_accessed_at = NOW()
      RETURNING *
    `;

    const result = await db.query(query, [
      req.userId,
      req.sessionId,
      tutorial_id,
      current_step || null,
      completed ? new Date() : null,
      time_spent || 0,
    ]);

    logger.info({
      event: 'progress_updated',
      tutorial_id,
      user_id: req.userId,
    });

    res.json({
      success: true,
      data: {
        tutorial_id: result.rows[0].tutorial_id,
        current_step: result.rows[0].current_step,
        completed: !!result.rows[0].completed_at,
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
