/**
 * Feedback API Routes
 * POST /v1/feedback
 * POST /v1/report-scam
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

/**
 * POST /v1/feedback
 * Submit feedback on analysis results
 */
router.post('/', [
  body('analysis_id').isUUID().withMessage('Invalid analysis ID'),
  body('feedback_type').isIn(['incorrect_safe', 'incorrect_scam', 'helpful', 'not_helpful'])
    .withMessage('Invalid feedback type'),
  body('comment').optional().isLength({ max: 500 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
      });
    }

    const { analysis_id, feedback_type, comment } = req.body;

    await db.query(
      `INSERT INTO analysis_feedback (analysis_id, feedback_type, comment) VALUES ($1, $2, $3)`,
      [analysis_id, feedback_type, comment || null]
    );

    res.json({
      success: true,
      message: 'Thank you for your feedback. This helps us improve!',
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
 * POST /v1/report-scam
 * Report a scam to authorities
 */
router.post('/report-scam', [
  body('analysis_id').optional().isUUID(),
  body('message_content').optional().isLength({ max: 10000 }),
  body('scam_type').optional().isString(),
  body('additional_info').optional().isLength({ max: 1000 }),
  body('contact_email').optional().isEmail(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
      });
    }

    const { analysis_id, message_content, scam_type, additional_info, contact_email } = req.body;
    const report_id = `RPT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await db.query(
      `INSERT INTO scam_reports (report_id, analysis_id, scam_type, message_content, additional_info, contact_email) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [report_id, analysis_id || null, scam_type || 'unknown', message_content || null, additional_info || null, contact_email || null]
    );

    res.json({
      success: true,
      data: {
        report_id,
        external_report_links: [
          {
            authority: 'Canadian Anti-Fraud Centre',
            url: 'https://www.antifraudcentre-centreantifraude.ca/report-signalez-eng.htm',
            phone: '1-888-495-8501',
          },
          {
            authority: 'FTC (USA)',
            url: 'https://reportfraud.ftc.gov/',
            phone: '1-888-382-1222',
          },
        ],
        next_steps: [
          "We've saved your report",
          'Click the link above to also report to the Canadian Anti-Fraud Centre',
        ],
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
