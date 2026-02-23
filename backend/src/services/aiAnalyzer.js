/**
 * AI-Powered Scam Detection Service
 * Uses OpenAI GPT-4 for advanced analysis
 */

const logger = require('../utils/logger');

const AI_CONFIG = {
  model: process.env.AI_MODEL || 'gpt-4-turbo',
  temperature: 0.1,
  max_tokens: 1000,
  timeout: 10000,
};

// Scam analysis prompt
const SCAM_ANALYSIS_PROMPT = `
You are a cybersecurity expert helping protect seniors from scams. 
Analyze the following message and determine if it's a scam.

MESSAGE:
{message}

ANALYSIS REQUIRED:
1. Intent: What is this message trying to get the recipient to do?
2. Red Flags: List specific warning signs (urgency, threats, unusual requests)
3. Legitimacy: How likely is this from a real organization?
4. Manipulation: What psychological tactics are being used?

RESPOND IN JSON FORMAT:
{{
    "is_scam": true/false,
    "confidence": 0.0-1.0,
    "scam_type": "phishing|tech_support|government|grandparent|romance|financial|prize|unknown",
    "red_flags": [
        {{
            "type": "category",
            "evidence": "exact quote from message",
            "severity": "low|medium|high|critical"
        }}
    ],
    "manipulation_tactics": ["urgency", "fear", "authority", "scarcity", "etc"],
    "legitimate_alternative": "What a real organization would do instead"
}}
`;

// Plain English explanation prompt
const EXPLANATION_PROMPT = `
You are explaining a scam analysis to a senior citizen (age 60-70) who may not be 
very familiar with technology. Use simple, clear language. Be reassuring, not scary.

VERDICT: {verdict}
CONFIDENCE: {confidence}
RED_FLAGS: {red_flags}

Write a brief explanation (2-3 sentences) that:
1. Clearly states if this is safe or a scam
2. Explains the MAIN reason why in simple terms
3. Uses an everyday analogy if helpful

Then provide 3-4 specific "What to Do" steps.

End with a reassuring message that validates their decision to check.

IMPORTANT TONE:
- Supportive, like a helpful friend
- No technical jargon
- No fear-mongering
- Empowering, not condescending

RESPOND IN JSON FORMAT:
{{
    "plain_english": "Your 2-3 sentence explanation",
    "what_to_do": ["step 1", "step 2", "step 3"],
    "reassurance": "A validating, encouraging message"
}}
`;

/**
 * Call OpenAI API
 */
const callOpenAI = async (prompt, message) => {
  const startTime = Date.now();
  
  try {
    // For now, we'll simulate the AI response since we don't have a real API key
    // In production, this would call the actual OpenAI API
    logger.info({
      event: 'ai_call_started',
      model: AI_CONFIG.model,
    });
    
    // Simulated response for development
    // In production, replace with actual OpenAI API call:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.max_tokens,
      }),
    });
    
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
    */
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const processingTime = Date.now() - startTime;
    logger.info({
      event: 'ai_call_completed',
      processing_time_ms: processingTime,
    });
    
    return null; // Return null to indicate fallback needed
    
  } catch (error) {
    logger.error({
      event: 'ai_call_failed',
      error: error.message,
    });
    throw error;
  }
};

/**
 * Analyze message with AI
 */
const analyzeWithAI = async (message, messageType = 'unknown') => {
  try {
    const prompt = SCAM_ANALYSIS_PROMPT.replace('{message}', message);
    const result = await callOpenAI(prompt, message);
    
    if (!result) {
      throw new Error('AI analysis failed - no result');
    }
    
    return result;
  } catch (error) {
    logger.error({
      event: 'ai_analysis_failed',
      error: error.message,
    });
    throw error;
  }
};

/**
 * Generate plain English explanation
 */
const generateExplanation = async (verdict, confidence, redFlags) => {
  try {
    const redFlagsStr = redFlags.map(rf => 
      `- ${rf.title}: ${rf.explanation}`
    ).join('\n');
    
    const prompt = EXPLANATION_PROMPT
      .replace('{verdict}', verdict)
      .replace('{confidence}', confidence)
      .replace('{red_flags}', redFlagsStr);
    
    const result = await callOpenAI(prompt, null);
    
    if (!result) {
      // Fallback to simple explanation
      return getFallbackExplanation(verdict, redFlags);
    }
    
    return result;
  } catch (error) {
    logger.error({
      event: 'explanation_generation_failed',
      error: error.message,
    });
    return getFallbackExplanation(verdict, redFlags);
  }
};

/**
 * Fallback explanation when AI is unavailable
 */
const getFallbackExplanation = (verdict, redFlags) => {
  const mainFlag = redFlags[0];
  
  let plainEnglish = '';
  let whatToDo = [];
  let reassurance = '';
  
  if (verdict === 'scam' || verdict === 'suspicious') {
    plainEnglish = mainFlag 
      ? `This message shows signs of being a scam. ${mainFlag.explanation}`
      : 'This message appears to be a scam. Be very careful with it.';
    
    whatToDo = [
      "Don't reply to this message",
      "Don't click any links",
      "Delete the message",
    ];
    
    reassurance = "You did the right thing by checking this message. Scammers are clever, but you're being smart by being cautious!";
  } else {
    plainEnglish = "This message doesn't have obvious signs of being a scam.";
    
    whatToDo = [
      'Still be cautious with unexpected messages',
      'When in doubt, don\'t click',
      'Verify by contacting the company directly',
    ];
    
    reassurance = "Good thinking to check this message! It's always better to be careful online.";
  }
  
  return {
    plain_english: plainEnglish,
    what_to_do: whatToDo,
    reassurance: reassurance,
  };
};

/**
 * Combined analysis with fallback
 */
const analyze = async (messageContent, messageType = 'unknown', ruleBasedResult = null) => {
  const startTime = Date.now();
  
  try {
    // Try AI analysis first
    const aiResult = await analyzeWithAI(messageContent, messageType);
    
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      ai_analysis: aiResult,
      processing_time_ms: processingTime,
    };
  } catch (error) {
    logger.warn({
      event: 'ai_analysis_fallback',
      error: error.message,
      using_rule_based: true,
    });
    
    // Return null to indicate fallback to rule-based
    return null;
  }
};

module.exports = {
  analyze,
  analyzeWithAI,
  generateExplanation,
  getFallbackExplanation,
  AI_CONFIG,
};
