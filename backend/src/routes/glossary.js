/**
 * Glossary API Routes
 * GET /v1/glossary
 */

const express = require('express');
const db = require('../db');

const router = express.Router();

/**
 * GET /v1/glossary
 * Search glossary terms
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, letter } = req.query;

    let query = `SELECT term, definition, analogy, related_terms, see_tutorial FROM glossary_terms`;
    const params = [];
    let conditions = [];

    if (search) {
      conditions.push(`(term ILIKE $1 OR definition ILIKE $1)`);
      params.push(`%${search}%`);
    }

    if (letter) {
      const idx = conditions.length + 1;
      conditions.push(`term ILIKE $${idx}`);
      params.push(`${letter}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY term ASC`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: {
        terms: result.rows.map(t => ({
          term: t.term,
          definition: t.definition,
          analogy: t.analogy,
          related_terms: t.related_terms,
          see_tutorial: t.see_tutorial,
        })),
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
 * GET /v1/glossary/:term
 * Get specific term
 */
router.get('/:term', async (req, res, next) => {
  try {
    const { term } = req.params;

    const result = await db.query(
      `SELECT * FROM glossary_terms WHERE term ILIKE $1`,
      [term]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Term not found' },
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
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
