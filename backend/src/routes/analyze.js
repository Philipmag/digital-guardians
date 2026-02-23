/**
 * Scam Analysis API Routes
 * POST /v1/analyze
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const db = require('../db');
const ruleEngine = require('../services/ruleEngine');
const aiAnalyzer = require('../services/aiAnalyzer');
const { analyzeLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

const router = express.Router();

// Apply rate limiter
router.use(analyzeLimiter);

// Validation middleware
const validateRequest = [
  body('message_content')
    .trim()
    .notEmpty()
    .withMessage('Please provide a message to analyze')
    .isLength({ max: 10000 })
    .withMessage('Message exceeds maximum length of 10,000 characters'),
  body('message_type')
    .optional()
    .isIn(['email', 'sms', 'social', 'unknown'])
    .withMessage('Invalid message type'),
  body('include_audio')
    .optional()
    .isBoolean(),
];

/**
 * Generate hash for duplicate detection
 */
const generateContentHash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

/**
 * Map verdict to API response format
 */
const mapVerdict = (verdict) => {
  if (verdict === 'safe') return 'safe';
  if (verdict === 'scam') return 'scam';
  return 'suspicious';
};

/**
 * Generate reassurance message
 */
const generateReassurance = (verdict) => {
  const messages = {
    scam: "You did the right thing by checking this message. Scammers are clever, and it's smart to be cautious. Well done for looking out for yourself!",
    suspicious: "Good thinking to check this message. You're developing great habits for staying safe online. It's completely okay to be careful!",
    safe: "This message looks safe, but remember that scammers are always creating new tricks. You did the right thing by being cautious!",
  };
  return messages[verdict] || messages.safe;
};

/**
 * POST /v1/analyze
 * Analyze a message for scam indicators
 */
router.post('/', validateRequest, async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.name = 'ValidationError';
      error.statusCode = 400;
      return next(error);
    }

    const { message_content, message_type = 'unknown', include_audio = false } = req.body;
    const startTime = Date.now();

    logger.info({
      event: 'analysis_request',
      message_type,
      content_length: message_content.length,
    });

    // Step 1: Fast rule-based analysis (always runs first)
    const ruleResult = ruleEngine.analyze(message_content, message_type);
    
    // Step 2: Try AI analysis (with timeout)
    let aiResult = null;
    let useFallback = true;
    
    try {
      const aiPromise = aiAnalyzer.analyze(message_content, message_type, ruleResult);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI timeout')), 8000)
      );
      
      aiResult = await Promise.race([aiPromise, timeoutPromise]);
      useFallback = !aiResult;
    } catch (aiError) {
      logger.warn({
        event: 'ai_analysis_skipped',
        reason: aiError.message,
      });
      useFallback = true;
    }

    // Combine results
    let finalVerdict = ruleResult.verdict;
    let finalConfidence = ruleResult.confidence;
    let finalIndicators = ruleResult.indicators;
    let scamType = ruleResult.scam_type;
    let riskScore = ruleResult.risk_score;

    // If AI succeeded, use its higher confidence results
    if (aiResult && aiResult.success && aiResult.ai_analysis) {
      const ai = aiResult.ai_analysis;
      
      // Use AI results if it has higher confidence
      if (ai.confidence > ruleResult.confidence) {
        finalVerdict = ai.is_scam ? (ai.confidence > 0.7 ? 'scam' : 'suspicious') : 'safe';
        finalConfidence = ai.confidence;
        scamType = ai.scam_type;
        
        // Merge indicators
        if (ai.red_flags && ai.red_flags.length > 0) {
          const aiIndicators = ai.red_flags.map(rf => ({
            type: rf.type,
            severity: rf.severity,
            evidence: rf.evidence,
            title: rf.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            explanation: getAIManipulationExplanation(rf.type),
          }));
          finalIndicators = [...finalIndicators, ...aiIndicators];
        }
      }
    }

    // Map to response format
    const mappedVerdict = mapVerdict(finalVerdict);

    // Generate explanation (always use fallback for now since AI is mocked)
    const explanation = ruleEngine.getGenericAdvice(mappedVerdict, finalIndicators);
    const reassurance = generateReassurance(mappedVerdict);

    // Generate response
    const analysisId = uuidv4();
    const processingTime = Date.now() - startTime;

    // Determine confidence label
    let confidenceLabel;
    if (finalConfidence >= 0.7) confidenceLabel = 'high';
    else if (finalConfidence >= 0.4) confidenceLabel = 'medium';
    else confidenceLabel = 'low';

    const response = {
      success: true,
      data: {
        analysis_id: analysisId,
        verdict: mappedVerdict,
        confidence: Math.round(finalConfidence * 100) / 100,
        confidence_label: confidenceLabel,
        risk_score: riskScore,
        indicators: finalIndicators.map(ind => ({
          type: ind.type,
          severity: ind.severity,
          evidence: ind.evidence,
          explanation: ind.explanation,
        })),
        summary: {
          plain_english: explanation.length > 0 
            ? `We found ${finalIndicators.length} warning signs in this message. ${finalIndicators[0].explanation}`
            : "We didn't find any clear warning signs in this message.",
          what_to_do: explanation,
          reassurance: reassurance,
        },
        scam_type: scamType,
        audio_url: null, // Would generate if include_audio is true
        report_links: {
          canada: 'https://www.antifraudcentre-centreantifraude.ca/report-signalez-eng.htm',
          usa: 'https://reportfraud.ftc.gov/',
        },
      },
      meta: {
        request_id: req.id,
        processing_time_ms: processingTime,
        model_version: '1.0.0',
      },
    };

    // Log analysis (anonymized - no message content)
    try {
      const contentHash = generateContentHash(message_content);
      const ipHash = req.ip ? crypto.createHash('sha256').update(req.ip).digest('hex').substring(0, 16) : null;
      
      await db.query(
        `INSERT INTO analysis_logs 
         (content_hash, verdict, confidence, risk_score, scam_type, indicators, message_type, processing_time_ms, model_version, ip_hash, session_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          contentHash,
          mappedVerdict,
          finalConfidence,
          riskScore,
          scamType,
          JSON.stringify(finalIndicators),
          message_type,
          processingTime,
          '1.0.0',
          ipHash,
          req.sessionID || null,
        ]
      );
    } catch (logError) {
      logger.warn({
        event: 'analysis_log_failed',
        error: logError.message,
      });
    }

    logger.info({
      event: 'analysis_completed',
      verdict: mappedVerdict,
      confidence: finalConfidence,
      processing_time_ms: processingTime,
    });

    res.status(200).json(response);

  } catch (error) {
    next(error);
  }
});

/**
 * Helper: Get explanation for AI manipulation types
 */
const getAIManipulationExplanation = (type) => {
  const explanations = {
    urgency: 'Scammers create fake urgency to make you act without thinking.',
    fear: 'They use fear tactics to scare you into compliance.',
    authority: 'They pretend to be trusted organizations to gain your trust.',
    scarcity: 'They claim limited time or availability to pressure you.',
    reciprocity: 'They offer something free to manipulate you.',
    social_proof: 'They fake testimonials to appear legitimate.',
  };
  return explanations[type] || 'This is a common scam tactic.';
};

module.exports = router;
