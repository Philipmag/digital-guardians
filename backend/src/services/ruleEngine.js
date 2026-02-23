/**
 * Rule-Based Scam Detection Engine
 * Fast, deterministic rules that catch obvious scams immediately
 */

const logger = require('../utils/logger');

// Scam indicator patterns
const SCAM_INDICATORS = {
  // Urgency patterns
  urgent_language: {
    patterns: [
      /act now/im,
      /immediately/im,
      /urgent/im,
      /expires today/im,
      /last chance/im,
      /final warning/im,
      /time sensitive/im,
      /don't delay/im,
      /hurry/im,
      /limited time/im,
      /asap/im,
      /right away/im,
    ],
    severity: 'medium',
    weight: 0.15,
    title: 'Creates urgency',
    explanation: 'Scammers often try to make you act fast without thinking.',
  },

  // Threat patterns
  threat_tactics: {
    patterns: [
      /arrest/im,
      /warrant/im,
      /legal action/im,
      /court/im,
      /account.*(suspend|close|terminate)/im,
      /lose.*(access|money|account)/im,
      /police/im,
      /rcmp/im,
      /irs/im,
    ],
    severity: 'high',
    weight: 0.25,
    title: 'Contains threats',
    explanation: 'Scammers use fear to make you act without thinking.',
  },

  // Payment red flags
  suspicious_payment: {
    patterns: [
      /gift card/im,
      /itunes card/im,
      /google play card/im,
      /wire transfer/im,
      /western union/im,
      /moneygram/im,
      /bitcoin/im,
      /cryptocurrency/im,
      /crypto/im,
      /prepaid debit card/im,
    ],
    severity: 'critical',
    weight: 0.30,
    title: 'Requests unusual payment',
    explanation: 'Real organizations never ask for gift cards or wire transfers.',
  },

  // Government impersonation
  government_spoof: {
    patterns: [
      /cra/im,
      /canada revenue/im,
      /social security/im,
      /tax refund/im,
      /tax owed/im,
      /tax payment/im,
      /government grant/im,
      /stimulus/im,
      /irs/im,
    ],
    severity: 'high',
    weight: 0.25,
    title: 'Claims to be from government',
    explanation: 'Real government agencies won\'t ask for payment through messages.',
  },

  // Tech support scam
  tech_support_scam: {
    patterns: [
      /microsoft.*support/im,
      /apple.*support/im,
      /google.*support/im,
      /computer.*infected/im,
      /virus detected/im,
      /call.*(this number|immediately|now)/im,
      /remote access/im,
      /teamviewer/im,
      /anydesk/im,
    ],
    severity: 'high',
    weight: 0.20,
    title: 'Tech support scam',
    explanation: 'Real companies won\'t call you about computer problems.',
  },

  // Grandparent scam signals
  grandparent_scam: {
    patterns: [
      /grandma/im,
      /grandpa/im,
      /nana/im,
      /papa/im,
      /(hospital|jail|accident).*money/im,
      /don't tell.*(mom|dad|parents)/im,
      /please help.*arrested/im,
      /please help.*emergency/im,
    ],
    severity: 'critical',
    weight: 0.35,
    title: 'Possible family emergency scam',
    explanation: 'This could be the "grandparent scam" where someone pretends to be a family member in trouble.',
  },

  // Suspicious sender
  suspicious_sender: {
    patterns: [
      /@gmail\.com$/im,
      /@yahoo\.com$/im,
      /@hotmail\.com$/im,
      /@aol\.com$/im,
      /@outlook\.com$/im,
    ],
    severity: 'medium',
    weight: 0.15,
    title: 'From free email service',
    explanation: 'Real organizations use their own domain names, not free email services.',
    check: 'sender',
  },

  // Generic greetings
  generic_greeting: {
    patterns: [
      /dear customer/im,
      /dear user/im,
      /dear member/im,
      /dear client/im,
      /valued customer/im,
      /dear email user/im,
    ],
    severity: 'low',
    weight: 0.05,
    title: 'Generic greeting',
    explanation: 'Real organizations usually address you by name.',
  },

  // Prize/lottery scams
  prize_scam: {
    patterns: [
      /you (have won|are the winner)/im,
      /congratulations.*winner/im,
      /claim.*prize/im,
      /lottery/im,
      /million.*dollars/im,
      /inheritance/im,
      /unclaimed.*fund/im,
    ],
    severity: 'high',
    weight: 0.30,
    title: 'Prize or lottery claim',
    explanation: 'If you didn\'t enter, you didn\'t win. Real prizes don\'t require payment to claim.',
  },
};

// Known scam domains
const KNOWN_SPOOFS = {
  amazon: ['@amazon-service.com', '@amazon-verify.biz', '@amazon-refund.com', '@amazon-support.net'],
  apple: ['@apple-id.com', '@icloud-support.com', '@apple-support.net'],
  paypal: ['@paypa1.com', '@paypal-verify.com', '@paypal-support.net'],
  cra: ['@cra-gov.biz', '@canada-revenue.com', '@cra-refund.com'],
  bank: ['@bank-secure.com', '@online-banking.net'],
  microsoft: ['@microsoft-support.net', '@windows-update.com'],
};

// Scoring thresholds
const VERDICT_THRESHOLDS = {
  scam: 0.70,
  suspicious: 0.40,
  safe: 0.20,
};

/**
 * Extract URLs from message
 */
const extractUrls = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
};

/**
 * Extract email addresses from message
 */
const extractEmails = (text) => {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const matches = text.match(emailRegex);
  return matches || [];
};

/**
 * Check for suspicious domains
 */
const checkSuspiciousDomains = (text) => {
  const found = [];
  const emails = extractEmails(text);
  
  for (const email of emails) {
    const domain = email.split('@')[1]?.toLowerCase();
    
    for (const [company, suspiciousDomains] of Object.entries(KNOWN_SPOOFS)) {
      for (const susDomain of suspiciousDomains) {
        const sus = susDomain.replace('@', '').toLowerCase();
        if (domain && (domain === sus || domain.endsWith('.' + sus))) {
          found.push({
            type: 'suspicious_sender',
            evidence: email,
            severity: 'high',
            title: `Fake ${company} email`,
            explanation: `This is not a real ${company} email address.`,
          });
        }
      }
    }
  }
  
  return found;
};

/**
 * Main analysis function
 */
const analyze = (messageContent, messageType = 'unknown') => {
  const startTime = Date.now();
  const indicators = [];
  let totalScore = 0;
  
  const normalizedContent = messageContent.toLowerCase();
  
  // Check each indicator category
  for (const [category, config] of Object.entries(SCAM_INDICATORS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(messageContent)) {
        // Find the matched text
        const match = messageContent.match(pattern);
        
        indicators.push({
          type: category,
          severity: config.severity,
          evidence: match ? match[0].substring(0, 100) : null,
          title: config.title,
          explanation: config.explanation,
        });
        
        totalScore += config.weight;
        break; // Only count each category once
      }
    }
  }
  
  // Check for suspicious domains
  const domainIssues = checkSuspiciousDomains(messageContent);
  indicators.push(...domainIssues);
  if (domainIssues.length > 0) {
    totalScore += 0.25;
  }
  
  // Extract URLs for potential URL scanning
  const urls = extractUrls(messageContent);
  
  // Determine verdict
  let verdict, confidence, confidenceLabel;
  
  if (totalScore >= VERDICT_THRESHOLDS.scam) {
    verdict = 'scam';
    confidence = Math.min(totalScore, 0.98);
    confidenceLabel = 'high';
  } else if (totalScore >= VERDICT_THRESHOLDS.suspicious) {
    verdict = 'suspicious';
    confidence = totalScore;
    confidenceLabel = 'medium';
  } else if (totalScore >= VERDICT_THRESHOLDS.safe) {
    verdict = 'suspicious';
    confidence = totalScore;
    confidenceLabel = 'low';
  } else {
    verdict = 'safe';
    confidence = 0.15;
    confidenceLabel = 'low';
  }
  
  // Determine scam type
  const scamType = determineScamType(indicators);
  
  const processingTime = Date.now() - startTime;
  
  logger.info({
    event: 'rule_analysis_completed',
    verdict,
    confidence,
    indicators_count: indicators.length,
    processing_time_ms: processingTime,
  });
  
  return {
    verdict,
    confidence,
    confidence_label: confidenceLabel,
    risk_score: Math.round(totalScore * 100),
    scam_type: scamType,
    indicators: indicators.map(ind => ({
      type: ind.type,
      severity: ind.severity,
      evidence: ind.evidence,
      title: ind.title,
      explanation: ind.explanation,
    })),
    urls_found: urls,
    processing_time_ms: processingTime,
    fallback_mode: false,
  };
};

/**
 * Determine scam type based on indicators
 */
const determineScamType = (indicators) => {
  const typeScores = {
    government_impersonation: 0,
    tech_support: 0,
    grandparent: 0,
    phishing: 0,
    financial: 0,
    prize: 0,
  };
  
  for (const indicator of indicators) {
    if (indicator.type === 'government_spoof') typeScores.government_impersonation += 1;
    if (indicator.type === 'tech_support_scam') typeScores.tech_support += 1;
    if (indicator.type === 'grandparent_scam') typeScores.grandparent += 1;
    if (indicator.type === 'suspicious_sender' || indicator.type === 'urgent_language') typeScores.phishing += 1;
    if (indicator.type === 'suspicious_payment') typeScores.financial += 1;
    if (indicator.type === 'prize_scam') typeScores.prize += 1;
  }
  
  // Find the highest scoring type
  let maxScore = 0;
  let detectedType = 'unknown';
  
  for (const [type, score] of Object.entries(typeScores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type;
    }
  }
  
  return detectedType;
};

/**
 * Generate generic advice based on verdict
 */
const getGenericAdvice = (verdict, indicators) => {
  const advice = [];
  
  if (verdict === 'scam' || verdict === 'suspicious') {
    advice.push("Don't reply to this message");
    advice.push("Don't click any links");
    advice.push("Delete the message");
    
    // Add specific advice based on indicators
    const hasPayment = indicators.some(i => i.type === 'suspicious_payment');
    const hasGov = indicators.some(i => i.type === 'government_spoof');
    const hasThreat = indicators.some(i => i.type === 'threat_tactics');
    
    if (hasPayment) {
      advice.push('Never pay with gift cards - real organizations never ask for this');
    }
    if (hasGov) {
      advice.push('Government agencies never ask for payment through messages');
      advice.push('If worried, call the real CRA at 1-800-959-8281');
    }
    if (hasThreat) {
      advice.push('Real companies don\'t threaten you through email');
    }
  }
  
  if (verdict === 'safe') {
    advice.push('Still be cautious with unexpected messages');
    advice.push('When in doubt, don\'t click');
  }
  
  return advice;
};

module.exports = {
  analyze,
  extractUrls,
  extractEmails,
  getGenericAdvice,
  SCAM_INDICATORS,
  VERDICT_THRESHOLDS,
};
