/**
 * Scam Alerts API Routes
 * GET /v1/alerts
 */

const express = require('express');
const db = require('../db');

const router = express.Router();

/**
 * GET /v1/alerts
 * Get current scam alerts
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, title, severity, summary, full_content, scam_type, 
              affected_regions, first_reported, is_active
       FROM scam_alerts 
       WHERE is_active = true 
       ORDER BY severity, created_at DESC`
    );

    res.json({
      success: true,
      data: {
        alerts: result.rows.map(a => ({
          id: a.id,
          title: a.title,
          severity: a.severity,
          summary: a.summary,
          full_content_url: a.full_content ? `/alerts/${a.id}` : null,
          scam_type: a.scam_type,
          first_reported: a.first_reported,
          is_active: a.is_active,
          affected_regions: a.affected_regions,
        })),
        last_updated: new Date().toISOString(),
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
 * GET /v1/alerts/:id
 * Get specific alert details
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT * FROM scam_alerts WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Alert not found' },
      });
    }

    const alert = result.rows[0];

    res.json({
      success: true,
      data: alert,
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
