# 🧠 SmartStudy Quiz Maker

> AI-powered quiz generator for students — paste your notes, get an instant interactive quiz.

Built for the **Global AI Hackathon**. SmartStudy uses Google Gemini to transform any study notes into 5 multiple-choice questions with instant feedback and scoring.

---

## ✨ Features

- **Paste notes → Get quiz** — Simply paste your study notes and click "Generate Quiz"
- **AI-powered questions** — Google Gemini generates contextual, understanding-based questions (not just memorization)
- **5 multiple-choice questions** — Each with 4 options, one clearly correct answer
- **Instant feedback** — Correct answers turn green, wrong answers turn red immediately
- **Score tracking** — Final score with percentage after completing all questions
- **Try Again** — Reset and generate a new quiz from fresh notes
- **Responsive design** — Works on desktop, tablet, and mobile
- **Secure API key handling** — Your Gemini key stays in `.env`, never exposed to frontend or Git

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js + Express |
| **AI** | Google Gemini API (`gemini-3.8-flash` / `gemini-3.5-flash-lite`) |
| **Security** | dotenv for environment variables |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A free [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the repository
```bash
git clone <repository-url>
cd smartstudy-quiz
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure your API key
```bash
cp .env.example .env
```

Edit `.env` and replace `your_api_key_here` with your real Gemini API key:
```
GEMINI_API_KEY=AIzaSy...
```

> ⚠️ **Never commit `.env`** — it's already in `.gitignore`.

### 4. Start the server
```bash
npm start
```

### 5. Open in browser
Navigate to `http://localhost:3000`

---

## 📸 Screenshots

<!-- Add your screenshots here -->

| Home | Quiz | Score |
|---|---|---|
| *Paste your study notes* | *Answer AI-generated questions* | *See your results* |

---

## 🎯 Demo Script (2 Minutes)

1. **Paste notes** about any topic (e.g., "Photosynthesis converts light energy into chemical energy...")
2. **Click "Generate Quiz"** — see the spinner while Gemini thinks
3. **Answer 5 questions** — watch instant color feedback (green = correct, red = wrong)
4. **View final score** — percentage and correct count
5. **Click "Try Again"** — start fresh with new notes

---

## 🏗 Architecture

```
Browser (HTML/CSS/JS)
    ↕
Express Server (Node.js)
    ↕
Google Gemini API
```

- **Frontend** sends study notes to `/generate-quiz`
- **Backend** calls Gemini with a structured prompt, parses JSON response, validates format
- **Fallback models** — if one Gemini model is busy, automatically tries the next
- **API key** lives only in `.env`, never in frontend code or Git history

---

## 📝 API Endpoint

### `POST /generate-quiz`

**Request body:**
```json
{
  "notes": "Your study notes text here..."
}
```

**Response:**
```json
{
  "questions": [
    {
      "text": "What is the main purpose of photosynthesis?",
      "options": ["To produce oxygen", "To convert light energy into chemical energy", "To create water", "To release carbon dioxide"],
      "correct": 1
    }
  ]
}
```

---

## 🔒 Security

- `.env` is excluded from Git via `.gitignore`
- `.env.example` contains only a placeholder value
- API key is loaded server-side only via `dotenv`
- No secrets in frontend code, logs, or browser DevTools

---

## 🎓 Hackathon Submission Info

- **Project:** SmartStudy Quiz Maker
- **Hackathon:** Global AI Hackathon
- **Category:** Education / AI-Assisted Learning
- **One-liner:** "Turn any study notes into an instant AI-powered quiz"

---

## 📄 License

ISC
