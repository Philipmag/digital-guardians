# Digital Guardians: Safe and Savvy Seniors

## A Nonprofit Digital Safety Platform for Older Adults

![Digital Guardians Logo](assets/images/logo-placeholder.png)

**Digital Guardians** is a mission-driven, ultra-accessible web platform designed to help seniors (60-70 years old) identify scams, learn safe digital habits, and build confidence with technology. Built with empathy and accessibility at its core.

---

## 🌟 Mission

To empower seniors to navigate the digital world safely and confidently, without fear or confusion. We believe everyone deserves to enjoy technology's benefits while being protected from those who would do harm.

---

## 🎯 Target Audience

- **Age:** 60-70 years
- **Location:** North America (US, Canada)
- **Language:** English
- **Digital Skill Level:** Low to moderate
- **Primary Concerns:** Fear of scams, difficulty with small text, uncertainty about clicking, anxiety about "breaking" something

---

## ✨ Core Features

### 1. AI Scam Message Analyzer
**What it does:**
- Users paste emails, texts, or messages into a large, clearly labeled input
- AI-driven analysis identifies common scam tactics
- Results include clear verdict, confidence level, plain-English explanation, and actionable advice

**User Experience:**
- No technical jargon ever
- Visual indicators (icons, colors) for different outcomes
- Reassuring language throughout
- Privacy-first: messages not stored without explicit consent

### 2. Learning Center
**Tutorials Available:**
- Email basics (reading, writing, managing)
- Setting up email accounts
- Creating strong passwords (simplified)
- Resetting/recovering passwords
- Recognizing scam emails
- Identifying fake links
- Safe browsing habits

**Tutorial Design Principles:**
- Max 1 action per step
- Realistic visual placeholders for screenshots
- Progress indicators ("Step 3 of 6")
- Text-to-speech narration with speed control
- Large tap targets
- Mobile-friendly

### 3. Accessibility Features (Always-On)
- **Large default font:** 18px base, readable without zooming
- **High contrast mode:** Toggle for enhanced visibility
- **Text-to-speech:** Global narration toggle
- **Adjustable narration speed:** 0.7x to 1.1x
- **Skip links:** Keyboard navigation support
- **ARIA labels:** Full screen reader compatibility
- **Reduced motion:** Respects system preferences

---

## 📁 Project Structure

```
Digital Guardians/
├── index.html          # Main landing page with scam analyzer
├── learning.html        # Learning Center with tutorials
├── styles.css           # Core accessibility-first design system
├── accessibility.css    # Additional accessibility enhancements
├── script.js            # Main application logic
├── learning.css         # Learning Center specific styles
├── learning.js          # Tutorial management system
├── README.md            # This file
└── assets/
    ├── images/          # Visual assets (placeholder)
    └── audio/           # Audio narration files (placeholder)
```

---

## 🎨 Design System

### Color Palette
| Color | Hex | Purpose |
|-------|-----|---------|
| Deep Teal | #1a5f7a | Primary brand color - trust, stability |
| Sage Green | #57837b | Secondary - calm, growth |
| Warm Amber | #c38d5c | Accent - friendly, helpful |
| Warm White | #fdfcf8 | Background - easy on eyes |
| Forest Green | #2d6a4f | Success indicators |
| Deep Red | #b91c1c | Danger/warning |
| Near Black | #1a1a1a | Primary text |

### Typography
- **Font:** System UI / Segoe UI / Arial (simple, familiar)
- **Base size:** 18px (larger than standard)
- **Line height:** 1.6 (readable)
- **Max line width:** 70ch (optimal reading)

### Touch Targets
- **Minimum button height:** 48-56px
- **Minimum tap area:** 44x44px
- **Spacing between interactive elements:** 8px+

---

## 🔒 Privacy & Security

### Our Promise
1. **No storage without consent:** Messages pasted for analysis are not stored unless the user explicitly agrees
2. **No data sharing:** User data is never sold or shared with third parties
3. **Transparent practices:** Privacy policy written in plain language
4. **Secure by default:** HTTPS, no unnecessary data collection

### Privacy Notice (Displayed to Users)
> "Your privacy matters: Messages you paste are analyzed but not stored. We never share your data."

---

## 🚀 Getting Started

### Local Development
1. Clone or download the project
2. Open `index.html` in any modern web browser
3. No build process required (pure HTML/CSS/JS)

### Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome for Android)

### Testing Accessibility
- Use browser DevTools to test responsive design
- Test with screen readers (NVDA, VoiceOver, JAWS)
- Test keyboard-only navigation
- Test with reduced motion enabled

---

## 📱 Mobile & Device Support

### iPhone Support
- **Tested models:** iPhone 7, iPhone 11, latest iPhone
- **Design considerations:**
  - Large touch targets
  - No small gestures required
  - Portrait and landscape support
  - Safari compatibility

### Android Support
- **Approach:** Mixed manufacturer compatibility
- **Design considerations:**
  - Chrome for Android primary target
  - Consistent layout across screen sizes
  - Large touch targets
  - No hidden menus

### Responsive Breakpoints
- **Desktop:** > 1024px
- **Tablet:** 768px - 1024px
- **Mobile:** < 768px
- **Small Mobile:** < 480px

---

## 🧠 AI Analysis Logic

### Detection Categories
The scam analyzer checks for:

1. **Urgency Indicators**
   - "urgent", "immediately", "act now", "limited time"

2. **Authority Claims**
   - "government", "IRS", "bank", "federal", "official"

3. **Financial Requests**
   - "wire transfer", "gift card", "bitcoin", "payment"

4. **Personal Information Requests**
   - "social security", "password", "verify identity"

5. **Suspicious Links**
   - "click here", URL shorteners (bit.ly, tinyurl)

6. **Suspicious Senders**
   - Free email domains (@gmail.com, @yahoo.com)

7. **Generic Greetings**
   - "dear customer", "valued customer"

8. **Threats**
   - "arrest", "legal action", "suspended", "locked"

### Confidence Scoring
- **High Confidence (4+ indicators):** Clear scam
- **Medium Confidence (2-3 indicators):** Likely scam
- **Low Confidence (1 indicator):** Possible concern
- **Safe (0 indicators):** No obvious red flags

---

## 📋 Content Structure

### Homepage Sections
1. Hero (tagline + encouragement)
2. Scam Analyzer (main feature)
3. How It Works (3-step process)
4. Learning Center Teaser
5. About Digital Guardians
6. Emergency Resources (scam recovery)

### Learning Center Categories
1. **Email Basics** (2 tutorials)
   - Reading email
   - Setting up email
2. **Passwords** (3 tutorials)
   - Creating strong passwords
   - Resetting passwords
   - Managing multiple passwords
3. **Spotting Scams** (4 tutorials)
   - Recognizing scam emails
   - Understanding why scams work
   - Identifying fake links
   - Safe digital habits
4. **Safe Browsing** (2 tutorials)
   - Recognizing trustworthy websites
   - Browser safety basics

---

## 🔮 Future Roadmap

### Phase 2: Enhanced Protection
- [ ] **Voice Call Scam Detection:** Analyze recorded voice messages
- [ ] **QR Code Safety:** Check QR codes before scanning
- [ ] **Multi-language Support:** Spanish, French
- [ ] **SMS/Text Message Analysis:** Full SMS support
- [ ] **Social Media Protection:** Facebook, Instagram analysis

### Phase 3: Community & Support
- [ ] **Volunteer Buddy System:** Trained volunteers for 1-on-1 help
- [ ] **Community Forums:** Peer support community
- [ ] **Live Chat Support:** Real-time help from volunteers
- [ ] **Phone Support:** For those who prefer telephone
- [ ] **Family Dashboard:** Optional family alerts (with consent)

### Phase 4: Advanced Features
- [ ] **Browser Extension:** Real-time scam warnings while browsing
- [ ] **Mobile App:** Native iOS/Android apps
- [ ] **Offline Mode:** Downloadable resources
- [ ] **Video Tutorials:** Supplementary video content
- [ ] **Gamification:** Achievement badges for learning

### Phase 5: Scale & Impact
- [ ] **Partner Integration:** Banks, credit unions
- [ ] **Healthcare Partnerships:** Medicare fraud protection
- [ ] **Government Recognition:** Certified nonprofit status
- [ ] **Research Partnerships:** Academic impact studies
- [ ] **International Expansion:** UK, Australia, EU

---

## 🏢 Organization

### Nonprofit Status
- **Type:** 501(c)(3) nonprofit organization (target)
- **Mission:** Protect seniors from digital fraud
- **Values:** Trust, patience, non-judgment, clarity

### Brand Personality
- ✅ Trustworthy
- ✅ Patient
- ✅ Reassuring
- ✅ Non-judgmental
- ✅ Plainspoken

### Tone Guidelines
- ❌ Never use fear-based language
- ❌ Never imply user "should have known better"
- ✅ Always reassure and encourage
- ✅ Use "we" and "you" frequently
- ✅ Acknowledge scam sophistication

---

## 🤝 Contributing

### Development Priorities
1. **Accessibility First:** Every change must pass WCAG 2.1 AA
2. **Senior Testing:** Regular testing with target demographic
3. **Plain Language:** Content reviewed for simplicity
4. **Performance:** Fast load times, especially on older devices

### Design Review Checklist
- [ ] Font size minimum 18px
- [ ] Color contrast ratio 4.5:1+
- [ ] Touch targets 44x44px minimum
- [ ] No auto-playing audio
- [ ] No fast animations
- [ ] Clear error messages in plain language
- [ ] Confirmation before destructive actions

---

## 📞 Emergency Resources

### If You Suspect a Scam
1. **Don't panic** — These things happen to smart people
2. **Stop contact** with the person/website
3. **Call your bank** using the number on your card
4. **Change passwords** for affected accounts
5. **Report it** to help protect others

### Where to Report
- **USA:** FTC ReportFraud.ftc.gov
- **Canada:** Canadian Anti-Fraud Centre
- **Local Police:** Non-emergency line

---

## 📄 License

This project is dedicated to the public domain under the [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) dedication.

**Use it, modify it, share it — for the protection of seniors everywhere.**

---

## 🙏 Acknowledgments

- Senior advocacy organizations for input and testing
- Accessibility consultants for WCAG guidance
- Cybersecurity experts for scam pattern analysis
- All volunteers who make this mission possible

---

## 📞 Contact

**Digital Guardians**
- Website: [placeholder]
- Email: [placeholder]
- Address: [placeholder]

*This project was built with love, patience, and a deep respect for the wisdom and dignity of older adults.*

---

**Remember:** You're doing the right thing by learning. Scams are getting harder to spot, and asking for help is the smart thing to do. You've got this! 🌟
