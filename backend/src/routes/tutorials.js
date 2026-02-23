/**
 * Tutorials API Routes
 * GET /v1/tutorials
 * GET /v1/tutorials/:id
 * GET /v1/tutorials/:id/quiz
 */

const express = require('express');
const db = require('../db');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * GET /v1/tutorials
 * List all tutorials with optional filtering
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, difficulty, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT id, title, description, category, difficulty, duration_minutes, 
             thumbnail_url, has_audio, has_quiz, popularity_score, created_at, updated_at
      FROM tutorials
      WHERE is_published = true
    `;
    
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (difficulty) {
      query += ` AND difficulty = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }

    query += ` ORDER BY popularity_score DESC, sort_order ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM tutorials WHERE is_published = true`;
    if (category) {
      countQuery += ` AND category = $1`;
    }
    
    const countResult = await db.query(countQuery, category ? [category] : []);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        tutorials: result.rows.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          difficulty: t.difficulty,
          duration_minutes: t.duration_minutes,
          steps_count: 0, // Would need to join to get this
          thumbnail_url: t.thumbnail_url,
          has_audio: t.has_audio,
          has_quiz: t.has_quiz,
          popularity_rank: t.popularity_score,
          created_at: t.created_at,
          updated_at: t.updated_at,
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: parseInt(offset) + result.rows.length < total,
        },
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
 * GET /v1/tutorials/:id
 * Get full tutorial content
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get tutorial
    const tutorialResult = await db.query(
      `SELECT * FROM tutorials WHERE id = $1 AND is_published = true`,
      [id]
    );

    if (tutorialResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tutorial not found' },
      });
    }

    const tutorial = tutorialResult.rows[0];

    // Get tutorial steps
    const stepsResult = await db.query(
      `SELECT step_number, title, content_html, content_plain, image_url, image_alt, 
              audio_url, audio_duration_seconds, tips
       FROM tutorial_steps 
       WHERE tutorial_id = $1 
       ORDER BY step_number`,
      [id]
    );

    // Get quiz if exists
    const quizResult = await db.query(
      `SELECT id, title, instructions, passing_score FROM quizzes WHERE tutorial_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        id: tutorial.id,
        title: tutorial.title,
        description: tutorial.description,
        category: tutorial.category,
        difficulty: tutorial.difficulty,
        duration_minutes: tutorial.duration_minutes,
        steps: stepsResult.rows.map(s => ({
          step_number: s.step_number,
          title: s.title,
          content_html: s.content_html,
          content_plain: s.content_plain,
          image_url: s.image_url,
          image_alt: s.image_alt,
          audio_url: s.audio_url,
          audio_duration_seconds: s.audio_duration_seconds,
          tips: s.tips,
        })),
        quiz: quizResult.rows.length > 0 ? {
          id: quizResult.rows[0].id,
          title: quizResult.rows[0].title,
          instructions: quizResult.rows[0].instructions,
          passing_score: quizResult.rows[0].passing_score,
        } : null,
        downloadable_pdf_url: tutorial.downloadable_pdf_url,
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
 * GET /v1/tutorials/:id/quiz
 * Get quiz questions for a tutorial
 */
router.get('/:id/quiz', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get quiz
    const quizResult = await db.query(
      `SELECT q.*, t.title as tutorial_title 
       FROM quizzes q 
       JOIN tutorials t ON q.tutorial_id = t.id 
       WHERE q.tutorial_id = $1`,
      [id]
    );

    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quiz not found' },
      });
    }

    const quiz = quizResult.rows[0];

    // Get questions
    const questionsResult = await db.query(
      `SELECT id, question_text, question_type, scenario, options, explanation
       FROM quiz_questions 
       WHERE quiz_id = $1 
       ORDER BY question_order`,
      [quiz.id]
    );

    res.json({
      success: true,
      data: {
        quiz_id: quiz.id,
        tutorial_id: quiz.tutorial_id,
        title: quiz.title,
        instructions: quiz.instructions,
        questions: questionsResult.rows.map(q => ({
          id: q.id,
          question: q.question_text,
          type: q.question_type,
          scenario: q.scenario,
          options: q.options,
          // Don't send correct answer in GET
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
 * POST /v1/tutorials/:id/quiz/submit
 * Submit quiz answers
 */
router.post('/:id/quiz/submit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers = [], session_id } = req.body;

    // Get quiz
    const quizResult = await db.query(
      `SELECT * FROM quizzes WHERE tutorial_id = $1`,
      [id]
    );

    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Quiz not found' },
      });
    }

    const quiz = quizResult.rows[0];

    // Get questions with answers
    const questionsResult = await db.query(
      `SELECT id, correct_answer, explanation FROM quiz_questions WHERE quiz_id = $1`,
      [quiz.id]
    );

    // Check answers
    let correctCount = 0;
    const results = questionsResult.rows.map(q => {
      const userAnswer = answers.find(a => a.question_id === q.id);
      const isCorrect = userAnswer?.selected_option === q.correct_answer;
      if (isCorrect) correctCount++;

      return {
        question_id: q.id,
        correct: isCorrect,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((correctCount / results.length) * 100);
    const passed = percentage >= quiz.passing_score;

    // Generate encouragement
    let encouragement = '';
    if (percentage === 100) {
      encouragement = "Perfect score! You're a Digital Guardian! 🛡️";
    } else if (percentage >= 80) {
      encouragement = "Great job! You're learning fast!";
    } else if (percentage >= 60) {
      encouragement = "Good effort! Review the lesson and try again.";
    } else {
      encouragement = "Keep learning! These skills take practice.";
    }

    res.json({
      success: true,
      data: {
        score: correctCount,
        total: results.length,
        percentage,
        passed,
        passing_score: quiz.passing_score,
        results,
        encouragement,
        certificate_eligible: passed,
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
