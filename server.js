const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

// Initialize Gemini AI with your secret API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Generate quiz endpoint
app.post('/generate-quiz', async (req, res) => {
    try {
        const { notes } = req.body;
        
        if (!notes || notes.trim().length < 10) {
            return res.status(400).json({ 
                error: 'Please provide at least 10 characters of study notes' 
            });
        }

        // Generate quiz using Gemini AI
        const quiz = await generateQuizWithAI(notes);
        
        res.json(quiz);
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

// AI Quiz Generation Function — tries multiple Gemini models with fallback
async function generateQuizWithAI(notes) {
    const prompt = `You are a quiz generator for students. Based on the following study notes, generate exactly 5 multiple-choice questions.

RULES:
- Each question must have exactly 4 answer options.
- One option must be clearly correct.
- Questions should test understanding, not just memorization.
- Return ONLY valid JSON in this exact format, nothing else:
{
  "questions": [
    {
      "text": "question text here",
      "options": ["option A", "option B", "option C", "option D"],
      "correct": 0
    }
  ]
}
- The "correct" field is the index (0-3) of the correct option.

STUDY NOTES:
${notes}`;

    const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];
    let lastError = null;

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Extract JSON from the response (Gemini sometimes wraps it in markdown)
            let jsonStr = responseText;
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }

            const quiz = JSON.parse(jsonStr);

            // Validate the quiz structure
            if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
                throw new Error('Invalid quiz format received from AI');
            }

            quiz.questions.forEach((q, i) => {
                if (!q.text || !q.options || q.options.length !== 4 || typeof q.correct !== 'number') {
                    throw new Error(`Invalid question format at index ${i}`);
                }
            });

            console.log(`Quiz generated successfully using model: ${modelName}`);
            return quiz;
        } catch (err) {
            lastError = err;
            console.log(`Model ${modelName} failed: ${err.message}`);
            continue;
        }
    }

    throw lastError || new Error('All Gemini models failed');
}

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});