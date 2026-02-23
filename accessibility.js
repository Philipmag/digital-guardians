/**
 * Digital Guardians - Accessibility Controls
 * 
 * Implements accessibility features according to specification:
 * - Text size toggle (Normal, +25%, +50%)
 * - High contrast mode
 * - Audio narration (text-to-speech)
 */

const AccessibilityController = {
    // State
    state: {
        textSize: 'normal', // 'normal', 'large', 'extra-large'
        highContrast: false,
        audioEnabled: false,
        audioSpeed: 0.9
    },

    /**
     * Initialize accessibility controls
     */
    init() {
        this.loadPreferences();
        this.bindEvents();
        this.applyPreferences();
    },

    /**
     * Load saved preferences from localStorage
     */
    loadPreferences() {
        try {
            const saved = localStorage.getItem('dg-accessibility');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.state = { ...this.state, ...prefs };
            }
        } catch (e) {
            console.log('Could not load accessibility preferences');
        }
    },

    /**
     * Save preferences to localStorage
     */
    savePreferences() {
        try {
            localStorage.setItem('dg-accessibility', JSON.stringify(this.state));
        } catch (e) {
            console.log('Could not save accessibility preferences');
        }
    },

    /**
     * Bind event listeners to accessibility controls
     */
    bindEvents() {
        // Text size button
        const textSizeBtn = document.getElementById('textSizeBtn');
        if (textSizeBtn) {
            textSizeBtn.addEventListener('click', () => this.cycleTextSize());
        }

        // High contrast button
        const contrastBtn = document.getElementById('contrastBtn');
        if (contrastBtn) {
            contrastBtn.addEventListener('click', () => this.toggleHighContrast());
        }

        // Audio toggle button
        const audioToggleBtn = document.getElementById('audioToggleBtn');
        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', () => this.toggleAudio());
        }

        // Audio speed control (if exists)
        const audioSpeed = document.getElementById('audioSpeed');
        if (audioSpeed) {
            audioSpeed.addEventListener('change', (e) => {
                this.state.audioSpeed = parseFloat(e.target.value);
                this.applyAudioSpeed();
            });
        }

        // Listen for system accessibility preferences
        if (window.matchMedia) {
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
                if (e.matches) {
                    document.body.classList.add('reduced-motion');
                } else {
                    document.body.classList.remove('reduced-motion');
                }
            });
        }
    },

    /**
     * Cycle through text size options
     * Normal -> Large (+25%) -> Extra Large (+50%) -> Normal
     */
    cycleTextSize() {
        const sizes = ['normal', 'large', 'extra-large'];
        const currentIndex = sizes.indexOf(this.state.textSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        this.state.textSize = sizes[nextIndex];
        
        this.applyTextSize();
        this.savePreferences();
        this.announce(`Text size: ${this.getTextSizeLabel()}`);
    },

    /**
     * Get human-readable text size label
     */
    getTextSizeLabel() {
        const labels = {
            'normal': 'Normal',
            'large': 'Large (+25%)',
            'extra-large': 'Extra Large (+50%)'
        };
        return labels[this.state.textSize];
    },

    /**
     * Apply text size to document
     */
    applyTextSize() {
        const body = document.body;
        
        // Remove existing text size classes
        body.classList.remove('large-text', 'extra-large-text');
        
        // Apply new text size class
        if (this.state.textSize === 'large') {
            body.classList.add('large-text');
        } else if (this.state.textSize === 'extra-large') {
            body.classList.add('extra-large-text');
        }

        // Update button label to show current size
        this.updateTextSizeButton();
    },

    /**
     * Update text size button appearance
     */
    updateTextSizeButton() {
        const btn = document.getElementById('textSizeBtn');
        if (!btn) return;

        const labels = {
            'normal': 'A',
            'large': 'A+',
            'extra-large': 'A++'
        };

        const span = btn.querySelector('span');
        if (span) {
            span.textContent = labels[this.state.textSize];
        }

        // Update aria-pressed state
        const pressed = this.state.textSize !== 'normal';
        btn.setAttribute('aria-pressed', pressed);
    },

    /**
     * Toggle high contrast mode
     */
    toggleHighContrast() {
        this.state.highContrast = !this.state.highContrast;
        
        const body = document.body;
        if (this.state.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }

        this.savePreferences();
        this.announce(this.state.highContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
    },

    /**
     * Apply high contrast state
     */
    applyHighContrast() {
        const body = document.body;
        if (this.state.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }

        // Update button state
        const btn = document.getElementById('contrastBtn');
        if (btn) {
            btn.setAttribute('aria-pressed', this.state.highContrast);
        }
    },

    /**
     * Toggle audio narration
     */
    toggleAudio() {
        this.state.audioEnabled = !this.state.audioEnabled;
        
        // Update button appearance
        const btn = document.getElementById('audioToggleBtn');
        if (btn) {
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = this.state.audioEnabled ? '🔊' : '🔇';
            }
            btn.setAttribute('aria-pressed', this.state.audioEnabled);
        }

        this.savePreferences();
        this.announce(this.state.audioEnabled ? 'Audio narration enabled' : 'Audio narration disabled');
    },

    /**
     * Apply audio settings
     */
    applyAudioSettings() {
        const btn = document.getElementById('audioToggleBtn');
        if (btn) {
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = this.state.audioEnabled ? '🔊' : '🔇';
            }
            btn.setAttribute('aria-pressed', this.state.audioEnabled);
        }

        // Apply audio speed if control exists
        const audioSpeed = document.getElementById('audioSpeed');
        if (audioSpeed) {
            audioSpeed.value = this.state.audioSpeed;
        }
    },

    /**
     * Apply audio speed to narration
     */
    applyAudioSpeed() {
        const audio = document.getElementById('narrationAudio');
        if (audio) {
            audio.playbackRate = this.state.audioSpeed;
        }
    },

    /**
     * Apply all preferences to document
     */
    applyPreferences() {
        this.applyTextSize();
        this.applyHighContrast();
        this.applyAudioSettings();
    },

    /**
     * Read text aloud using Web Speech API
     * @param {string} text - Text to read
     */
    speak(text) {
        if (!this.state.audioEnabled) return;

        // Cancel any ongoing speech
        this.stopSpeaking();

        // Use Web Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = this.state.audioSpeed;
            utterance.onend = () => {
                this.isSpeaking = false;
            };
            
            this.isSpeaking = true;
            window.speechSynthesis.speak(utterance);
        }
    },

    /**
     * Stop any ongoing speech
     */
    stopSpeaking() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        this.isSpeaking = false;
    },

    /**
     * Check if currently speaking
     */
    isSpeaking: false,

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announce(message) {
        // Create or get live region
        let liveRegion = document.getElementById('a11y-announcer');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'a11y-announcer';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(liveRegion);
        }

        // Clear and set message
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AccessibilityController.init());
} else {
    AccessibilityController.init();
}

// Expose globally for use in other scripts
window.AccessibilityController = AccessibilityController;
