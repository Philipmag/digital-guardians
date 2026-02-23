/**
 * Digital Guardians - Safe and Savvy Seniors
 * Main Application JavaScript
 * 
 * Core Features:
 * - AI-driven scam message analysis
 * - Accessible result display
 * - Text-to-speech narration
 * - Privacy-first data handling
 */

// ============================================================================
// SCAM DETECTION ENGINE (AI Mock)
// ============================================================================

const ScamDetectionEngine = {
    // Common scam patterns and keywords
    patterns: {
        urgency: [
            /urgent/i,
            /immediate(ly)?/i,
            /act now/i,
            /limited time/i,
            /expires/i,
            /deadline/i,
            /hurry/i,
            /last chance/i,
            /don't delay/i,
            /asap/i,
            /right away/i
        ],
        authority: [
            /government/i,
            /irs/i,
            /social security/i,
            /bank/i,
            /federal/i,
            /official/i,
            /legal/i,
            /court/i,
            /warrant/i,
            /arrest/i,
            /legal action/i
        ],
        financial: [
            /bank account/i,
            /credit card/i,
            /wire transfer/i,
            /gift card/i,
            /bitcoin/i,
            /crypto/i,
            /payment/i,
            /owe/i,
            /debt/i,
            /refund/i,
            /prize/i,
            /winner/i,
            /lottery/i,
            /million dollars/i,
            /inheritance/i
        ],
        personalInfo: [
            /social security/i,
            /date of birth/i,
            /password/i,
            /pin/i,
            /verify your identity/i,
            /confirm your account/i,
            /update your information/i,
            /personal information/i
        ],
        suspiciousLinks: [
            /click here/i,
            /click below/i,
            /click the link/i,
            /follow this link/i,
            /visit (this|the) website/i,
            /bit\.ly/i,
            /tinyurl/i,
            /ow\.ly/i,
            /t\.co/i
        ],
        suspiciousSender: [
            /@gmail\.com/i,
            /@yahoo\.com/i,
            /@hotmail\.com/i,
            /@aol\.com/i,
            /@[a-z]+\.[a-z]{2,}/i
        ],
        greeting: [
            /dear customer/i,
            /dear user/i,
            /dear member/i,
            /dear client/i,
            /valued customer/i
        ],
        grammar: [
            /\s{2,}/g,
            /[!?]{2,}/g
        ],
        threats: [
            /will be arrested/i,
            /will be deported/i,
            /your account (has been|will be)/i,
            /legal action/i,
            /sue/i,
            /warrant/i,
            /investigation/i,
            /fraud alert/i,
            /unauthorized/i,
            /suspended/i,
            /locked/i
        ]
    },

    /**
     * Analyze message for scam indicators
     * @param {string} message - The message to analyze
     * @returns {object} Analysis results
     */
    analyze(message) {
        if (!message || message.trim().length === 0) {
            return {
                verdict: 'insufficient',
                confidence: 'low',
                indicators: [],
                explanation: [],
                recommendations: []
            };
        }

        const normalizedMessage = message.toLowerCase();
        const indicators = [];
        const explanation = [];

        // Check for urgency
        const urgencyMatches = this.patterns.urgency.filter(pattern => pattern.test(normalizedMessage));
        if (urgencyMatches.length > 0) {
            indicators.push({ type: 'urgency', count: urgencyMatches.length });
            explanation.push({
                title: 'Creates a sense of urgency',
                description: 'Scammers often try to make you act fast without thinking.'
            });
        }

        // Check for authority claims
        const authorityMatches = this.patterns.authority.filter(pattern => pattern.test(normalizedMessage));
        if (authorityMatches.length > 0) {
            indicators.push({ type: 'authority', count: authorityMatches.length });
            explanation.push({
                title: 'Claims to be from a government or bank',
                description: 'Real organizations don\'t ask for personal info through emails or texts.'
            });
        }

        // Check for financial requests
        const financialMatches = this.patterns.financial.filter(pattern => pattern.test(normalizedMessage));
        if (financialMatches.length > 0) {
            indicators.push({ type: 'financial', count: financialMatches.length });
            explanation.push({
                title: 'Asks for money or payment',
                description: 'Be careful with any message asking for payment, especially unusual methods.'
            });
        }

        // Check for personal info requests
        const personalInfoMatches = this.patterns.personalInfo.filter(pattern => pattern.test(normalizedMessage));
        if (personalInfoMatches.length > 0) {
            indicators.push({ type: 'personalInfo', count: personalInfoMatches.length });
            explanation.push({
                title: 'Asks for personal information',
                description: 'Legitimate companies won\'t ask for passwords or Social Security numbers this way.'
            });
        }

        // Check for suspicious links
        const linkMatches = this.patterns.suspiciousLinks.filter(pattern => pattern.test(normalizedMessage));
        if (linkMatches.length > 0) {
            indicators.push({ type: 'suspiciousLinks', count: linkMatches.length });
            explanation.push({
                title: 'Contains suspicious links',
                description: 'Scammers use links to steal your information. Don\'t click unless you\'re sure.'
            });
        }

        // Check for suspicious sender patterns
        const senderMatches = this.patterns.suspiciousSender.filter(pattern => pattern.test(normalizedMessage));
        if (senderMatches.length > 0 && this.containsEmail(normalizedMessage)) {
            indicators.push({ type: 'suspiciousSender', count: senderMatches.length });
            explanation.push({
                title: 'From an unofficial email address',
                description: 'Real organizations use their own domain names, not free email services.'
            });
        }

        // Check for generic greetings
        const greetingMatches = this.patterns.greeting.filter(pattern => pattern.test(normalizedMessage));
        if (greetingMatches.length > 0) {
            indicators.push({ type: 'greeting', count: greetingMatches.length });
            explanation.push({
                title: 'Uses a generic greeting',
                description: 'Real organizations usually address you by name.'
            });
        }

        // Check for threats
        const threatMatches = this.patterns.threats.filter(pattern => pattern.test(normalizedMessage));
        if (threatMatches.length > 0) {
            indicators.push({ type: 'threats', count: threatMatches.length });
            explanation.push({
                title: 'Contains threats or warnings',
                description: 'Scammers use fear to make you act without thinking.'
            });
        }

        // Calculate verdict and confidence
        const totalIndicators = indicators.reduce((sum, i) => sum + i.count, 0);
        let verdict, confidence;

        if (totalIndicators >= 4) {
            verdict = 'danger';
            confidence = 'high';
        } else if (totalIndicators >= 2) {
            verdict = 'warning';
            confidence = 'medium';
        } else if (totalIndicators >= 1) {
            verdict = 'warning';
            confidence = 'low';
        } else {
            verdict = 'safe';
            confidence = 'medium';
        }

        // Generate recommendations
        const recommendations = this.generateRecommendations(verdict, indicators);

        return {
            verdict,
            confidence,
            indicators,
            explanation,
            recommendations,
            reassurance: this.generateReassurance(verdict)
        };
    },

    /**
     * Check if message contains an email address
     * @param {string} message - Message to check
     * @returns {boolean}
     */
    containsEmail(message) {
        return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(message);
    },

    /**
     * Generate recommendations based on analysis
     * @param {string} verdict - Verdict type
     * @param {array} indicators - Found indicators
     * @returns {array} Recommendations
     */
    generateRecommendations(verdict, indicators) {
        const recommendations = [];

        if (verdict === 'danger') {
            recommendations.push({
                action: 'Do NOT click any links',
                priority: 'high',
                description: 'Even if the message looks convincing, links can install harmful software.'
            });
            recommendations.push({
                action: 'Delete the message',
                priority: 'high',
                description: 'Remove it from your inbox and any other folders.'
            });
            recommendations.push({
                action: 'Don\'t reply',
                priority: 'high',
                description: 'Replying confirms your email is active and leads to more scams.'
            });
        } else if (verdict === 'warning') {
            recommendations.push({
                action: 'Don\'t click links',
                priority: 'high',
                description: 'If you need to check something, go to the website directly.'
            });
            recommendations.push({
                action: 'Call the organization directly',
                priority: 'medium',
                description: 'Use a phone number from your statement or card, not the message.'
            });
            recommendations.push({
                action: 'When in doubt, delete it',
                priority: 'low',
                description: 'It\'s okay to ignore messages that make you uncomfortable.'
            });
        } else {
            recommendations.push({
                action: 'Still be cautious',
                priority: 'low',
                description: 'Even safe-looking messages can sometimes be faked.'
            });
        }

        return recommendations;
    },

    /**
     * Generate reassuring message
     * @param {string} verdict - Verdict type
     * @returns {string}
     */
    generateReassurance(verdict) {
        const messages = {
            danger: "You did the right thing by checking this message. Scammers are clever, and it's smart to be cautious. Well done for looking out for yourself!",
            warning: "Good thinking to check this message. You're developing great habits for staying safe online. It's completely okay to be careful!",
            safe: "This message looks safe, but remember that scammers are always creating new tricks. You did the right thing by being cautious!"
        };
        return messages[verdict] || messages.safe;
    }
};

// ============================================================================
// UI CONTROLLER
// ============================================================================

const UIController = {
    /**
     * Display analysis results
     * @param {object} results - Analysis results
     */
    displayResults(results) {
        const resultsContainer = document.getElementById('analysisResults');
        
        const verdictData = {
            safe: {
                icon: '✓',
                text: 'This Looks Safe',
                class: 'safe'
            },
            warning: {
                icon: '⚠',
                text: 'We\'re Not Sure — Be Careful',
                class: 'warning'
            },
            danger: {
                icon: '✕',
                text: 'This Looks Like a Scam',
                class: 'danger'
            }
        };

        const data = verdictData[results.verdict];

        const html = `
            <div class="result-card ${data.class}" role="alert">
                <div class="result-header">
                    <div class="result-icon" aria-hidden="true">${data.icon}</div>
                    <span class="verdict">${data.text}</span>
                    <span class="confidence ${results.confidence}">${this.formatConfidence(results.confidence)}</span>
                </div>
                
                ${results.explanation.length > 0 ? `
                    <div class="result-section">
                        <h3>Why We Think This:</h3>
                        <ul class="explanation-list">
                            ${results.explanation.map(item => `
                                <li>
                                    <strong>${item.title}</strong><br>
                                    <span>${item.description}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="action-box">
                    <h4>What to Do Next:</h4>
                    <ul class="explanation-list">
                        ${results.recommendations.map(rec => `
                            <li>
                                <strong>${rec.action}</strong><br>
                                <span>${rec.description}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="reassurance">
                    ${results.reassurance}
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="window.printResults()">
                    Print These Results
                </button>
                <button class="btn btn-secondary" onclick="UIController.clearResults()">
                    Check Another Message
                </button>
            </div>
        `;

        resultsContainer.innerHTML = html;
        resultsContainer.classList.remove('hidden');
        
        // Announce results for screen readers
        this.announceResults(results);
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Format confidence level for display
     * @param {string} confidence - Confidence level
     * @returns {string} Formatted confidence
     */
    formatConfidence(confidence) {
        const labels = {
            high: 'High Confidence',
            medium: 'Medium Confidence',
            low: 'Low Confidence'
        };
        return labels[confidence] || confidence;
    },

    /**
     * Announce results for screen readers
     * @param {object} results - Analysis results
     */
    announceResults(results) {
        const verdictLabels = {
            safe: 'This message appears to be safe',
            warning: 'This message may be a scam, please be careful',
            danger: 'This message appears to be a scam'
        };
        
        const announcement = `${verdictLabels[results.verdict]}. Confidence level: ${results.confidence}. ${results.explanation.length} reasons identified.`;
        
        // Create live region announcement
        let liveRegion = document.getElementById('resultsAnnouncement');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'resultsAnnouncement';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = announcement;
    },

    /**
     * Clear analysis results
     */
    clearResults() {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        
        // Clear form
        document.getElementById('messageInput').value = '';
        document.getElementById('messageInput').focus();
        
        // Stop any narration
        AudioController.stop();
    },

    /**
     * Show loading state
     */
    showLoading() {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.innerHTML = `
            <div class="loading-state" role="status">
                <div class="loading-spinner" aria-hidden="true"></div>
                <p>Analyzing your message...</p>
                <p class="loading-hint">This usually takes a few seconds</p>
            </div>
        `;
        resultsContainer.classList.remove('hidden');
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        // Loading is replaced by results
    }
};

// ============================================================================
// AUDIO CONTROLLER (Text-to-Speech)
// ============================================================================

const AudioController = {
    synth: null,
    utterance: null,
    isPlaying: false,
    rate: 0.9, // Slightly slower for clarity

    /**
     * Initialize audio controller
     */
    init() {
        if ('speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
            this.loadSettings();
        } else {
            console.log('Text-to-speech not supported');
            this.disableAudioToggle();
        }
    },

    /**
     * Load audio settings from storage
     */
    loadSettings() {
        const savedRate = localStorage.getItem('dg_audio_rate');
        if (savedRate) {
            this.rate = parseFloat(savedRate);
        }
    },

    /**
     * Save audio settings
     */
    saveSettings() {
        localStorage.setItem('dg_audio_rate', this.rate.toString());
    },

    /**
     * Speak text
     * @param {string} text - Text to speak
     */
    speak(text) {
        if (!this.synth) return;

        this.stop(); // Stop any current speech

        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.rate = this.rate;
        this.utterance.lang = 'en-US';
        this.utterance.pitch = 1;

        // Select a clear voice
        const voices = this.synth.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang === 'en-US' && voice.name.includes('Google') || 
            voice.lang === 'en-US' && voice.name.includes('Microsoft')
        );
        if (preferredVoice) {
            this.utterance.voice = preferredVoice;
        }

        this.utterance.onstart = () => {
            this.isPlaying = true;
            this.updateAudioButton();
        };

        this.utterance.onend = () => {
            this.isPlaying = false;
            this.updateAudioButton();
        };

        this.utterance.onerror = () => {
            this.isPlaying = false;
            this.updateAudioButton();
        };

        this.synth.speak(this.utterance);
    },

    /**
     * Stop speaking
     */
    stop() {
        if (this.synth && this.isPlaying) {
            this.synth.cancel();
            this.isPlaying = false;
            this.updateAudioButton();
        }
    },

    /**
     * Toggle audio playback
     */
    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else if (this.utterance) {
            this.speak(this.utterance.text);
        }
    },

    /**
     * Update audio button state
     */
    updateAudioButton() {
        const btn = document.getElementById('audioToggleBtn');
        if (btn) {
            const icon = btn.querySelector('span');
            if (icon) {
                icon.textContent = this.isPlaying ? '🔊' : '🔈';
            }
        }
    },

    /**
     * Disable audio toggle if not supported
     */
    disableAudioToggle() {
        const btn = document.getElementById('audioToggleBtn');
        if (btn) {
            btn.disabled = true;
            btn.title = 'Audio narration not supported';
        }
    },

    /**
     * Set speech rate
     * @param {number} rate - Speech rate (0.5 to 1.5)
     */
    setRate(rate) {
        this.rate = Math.max(0.5, Math.min(1.5, rate));
        this.saveSettings();
    }
};

// ============================================================================
// ACCESSIBILITY CONTROLLER
// ============================================================================

const AccessibilityController = {
    settings: {
        largeText: false,
        highContrast: false,
        audioEnabled: false
    },

    /**
     * Initialize accessibility settings
     */
    init() {
        this.loadSettings();
        this.applySettings();
        this.bindEvents();
    },

    /**
     * Load settings from storage
     */
    loadSettings() {
        const saved = localStorage.getItem('dg_accessibility');
        if (saved) {
            try {
                this.settings = JSON.parse(saved);
            } catch (e) {
                console.log('Could not load accessibility settings');
            }
        }
    },

    /**
     * Save settings to storage
     */
    saveSettings() {
        localStorage.setItem('dg_accessibility', JSON.stringify(this.settings));
    },

    /**
     * Apply current settings to the page
     */
    applySettings() {
        // Large text
        document.body.classList.toggle('large-text', this.settings.largeText);
        document.getElementById('textSizeBtn')?.setAttribute('aria-pressed', this.settings.largeText);

        // High contrast
        document.body.classList.toggle('high-contrast', this.settings.highContrast);
        document.getElementById('contrastBtn')?.setAttribute('aria-pressed', this.settings.highContrast);

        // Audio
        localStorage.setItem('dg_audio_enabled', this.settings.audioEnabled);
        document.getElementById('audioToggleBtn')?.setAttribute('aria-pressed', this.settings.audioEnabled);
    },

    /**
     * Bind accessibility control events
     */
    bindEvents() {
        // Text size toggle
        const textSizeBtn = document.getElementById('textSizeBtn');
        if (textSizeBtn) {
            textSizeBtn.addEventListener('click', () => {
                this.settings.largeText = !this.settings.largeText;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Contrast toggle
        const contrastBtn = document.getElementById('contrastBtn');
        if (contrastBtn) {
            contrastBtn.addEventListener('click', () => {
                this.settings.highContrast = !this.settings.highContrast;
                this.saveSettings();
                this.applySettings();
            });
        }

        // Audio toggle
        const audioBtn = document.getElementById('audioToggleBtn');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                this.settings.audioEnabled = !this.settings.audioEnabled;
                this.saveSettings();
                this.applySettings();
                
                if (this.settings.audioEnabled && !AudioController.isPlaying) {
                    this.announceAudioEnabled();
                }
            });
        }
    },

    /**
     * Announce audio is enabled
     */
    announceAudioEnabled() {
        if (this.settings.audioEnabled) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            announcement.textContent = 'Audio narration enabled. Results will be read aloud.';
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 5000);
        }
    },

    /**
     * Get current settings
     * @returns {object}
     */
    getSettings() {
        return this.settings;
    }
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize controllers
    AccessibilityController.init();
    AudioController.init();

    // Form submission handler
    const form = document.getElementById('scamAnalyzerForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            
            if (!message) {
                messageInput.focus();
                return;
            }

            // Show loading
            UIController.showLoading();

            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Analyze message
            const results = ScamDetectionEngine.analyze(message);

            // Display results
            UIController.displayResults(results);

            // Read results aloud if audio is enabled
            if (AccessibilityController.getSettings().audioEnabled) {
                const resultsText = `Analysis complete. ${results.verdict === 'safe' ? 'This message appears safe' : results.verdict === 'warning' ? 'This message may be a scam, please be careful' : 'This message appears to be a scam'}. ${results.reassurance}`;
                AudioController.speak(resultsText);
            }
        });
    }
});

// ============================================================================
// GLOBAL HELPER FUNCTIONS
// ============================================================================

/**
 * Print results
 */
window.printResults = function() {
    window.print();
};

/**
 * Reset all settings
 */
window.resetAccessibility = function() {
    localStorage.removeItem('dg_accessibility');
    localStorage.removeItem('dg_audio_enabled');
    localStorage.removeItem('dg_audio_rate');
    location.reload();
};
