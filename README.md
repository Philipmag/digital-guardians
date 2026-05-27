# 🛡️ Digital Guardians

> An accessible cybersecurity education platform designed to protect seniors from online scams.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-blue?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Impact Microgrant Winner 2025](https://img.shields.io/badge/Impact%20Microgrant-Winner%202025-gold?style=flat-square)](https://github.com/Philipmag/digital-guardians)

---

## Overview

Seniors are disproportionately targeted by online scams, yet most cybersecurity tools are built for technically savvy users. Digital Guardians flips that — it's a web platform built from the ground up for users aged 60–70, with an AI-powered scam analyzer, step-by-step digital literacy tutorials, and always-on accessibility features like text-to-speech and high-contrast mode.

This project won the **Impact Microgrant 2025** for its community impact and accessibility-first approach. It was built in collaboration with a cross-functional team using Agile methodology.

---

## Demo

> **Status: Work in progress — backend API integration is ongoing.**

The frontend is fully functional and can be run by opening `index.html` in a browser. The backend Node.js API requires setup (see Getting Started).

**Live frontend features:**
- Paste any suspicious message into the scam analyzer — the rule engine returns an instant verdict.
- Browse the Learning Center for step-by-step tutorials on email safety, passwords, and scam recognition.
- Toggle high-contrast mode and text-to-speech narration from any page.

---

## Features

- **AI-Powered Scam Analyzer** — Users paste suspicious emails or texts; the system returns a verdict (safe/scam/suspicious), a confidence score, and a plain-English explanation written for non-technical users.
- **Learning Center** — Step-by-step tutorials on email basics, password safety, and scam recognition, each limited to one action per step with progress indicators.
- **WCAG 2.1 AA Accessibility** — 18px base font, high-contrast toggle, text-to-speech narration with speed control (0.7x–1.1x), full keyboard navigation, and ARIA labels throughout.
- **Rate-Limited API** — The backend enforces request rate limits to prevent abuse of the AI analysis endpoint.
- **Privacy-First Design** — Message content is hashed for duplicate detection only; no raw messages are stored without explicit user consent.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js, Express |
| AI Analysis | OpenAI GPT-4 (via backend API) |
| Database | PostgreSQL (via backend) |
| Accessibility | WCAG 2.1 AA, ARIA, Web Speech API |

---

## Getting Started

```bash
git clone https://github.com/Philipmag/digital-guardians
cd digital-guardians

# Frontend — open directly in browser
open index.html

# Backend API (optional for full AI analysis)
cd backend
cp .env.example .env   # add your OpenAI API key
npm install
node src/index.js
```

---

## How It Works

1. **User submits a message** → Frontend sends a POST request to `/v1/analyze` with the message content.
2. **Rule engine pre-screens** → `services/ruleEngine.js` checks for known scam patterns (urgency language, suspicious links, authority impersonation) and returns an instant verdict for clear-cut cases.
3. **AI deep-analysis** → For ambiguous cases, `services/aiAnalyzer.js` sends the message to GPT-4 with a structured prompt that returns scam type, red flags, and manipulation tactics in JSON.
4. **Plain-English response** → The result is translated into reassuring, jargon-free language before being displayed to the user.

---

## What I Learned

- **Accessibility is a design constraint, not an afterthought** — building for 18px base fonts and high-contrast mode from day one forced better layout decisions across the entire UI.
- **Rule-based + AI hybrid systems outperform either alone** — the rule engine catches obvious scams instantly (low latency), while GPT-4 handles nuanced social engineering that pattern matching misses.
- **Seniors need reassurance, not warnings** — user testing revealed that alarming language ("DANGER: SCAM DETECTED") caused anxiety; replacing it with calm, instructional language improved trust significantly.

---

## Roadmap

- [ ] Deploy the backend API to Railway or Render and connect the live AI analyzer to the frontend.
- [ ] Add user progress tracking so returning users can resume tutorials where they left off.
- [ ] Expand the tutorial library with video walkthroughs and interactive quizzes.
