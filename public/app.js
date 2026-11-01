// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const notesTextarea = document.getElementById('notes');
    const generateBtn = document.getElementById('generate-btn');
    const inputSection = document.getElementById('input-section');
    const quizSection = document.getElementById('quiz-section');
    const resultSection = document.getElementById('result-section');
    const questionContainer = document.getElementById('question-container');
    const finalScore = document.getElementById('final-score');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const errorMessage = document.getElementById('error-message');

    let currentQuiz = [];
    let userAnswers = [];

    generateBtn.addEventListener('click', generateQuiz);
    tryAgainBtn.addEventListener('click', resetQuiz);

    async function generateQuiz() {
        const notes = notesTextarea.value.trim();
        
        if (!notes) {
            showError('Please paste your study notes first!');
            return;
        }

        hideError();
        setLoading(true);

        try {
            const response = await fetch('/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || 'Failed to generate quiz');
            }

            const data = await response.json();
            currentQuiz = data.questions;
            userAnswers = new Array(currentQuiz.length).fill(null);
            
            displayQuiz();
            inputSection.classList.add('hidden');
            quizSection.classList.remove('hidden');
            resultSection.classList.add('hidden');
            
        } catch (error) {
            console.error('Error generating quiz:', error);
            showError(error.message || 'Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        if (isLoading) {
            generateBtn.innerHTML = '<span class="spinner"></span> Generating Quiz...';
        } else {
            generateBtn.textContent = 'Generate Quiz';
        }
    }

    function displayQuiz() {
        questionContainer.innerHTML = '';
        
        currentQuiz.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question';
            questionElement.innerHTML = `
                <h3>Question ${index + 1}: ${question.text}</h3>
                <div class="options">
                    ${question.options.map((option, optionIndex) => `
                        <div class="option" data-question="${index}" data-option="${optionIndex}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            `;
            
            questionContainer.appendChild(questionElement);
        });

        // Add click listeners to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', selectAnswer);
        });
    }

    function selectAnswer(event) {
        const questionIndex = parseInt(event.target.dataset.question);
        const optionIndex = parseInt(event.target.dataset.option);
        
        // Prevent changing answer
        if (userAnswers[questionIndex] !== null) {
            return;
        }
        
        userAnswers[questionIndex] = optionIndex;
        event.target.classList.add('selected');
        
        // Show correct answer immediately
        const correctIndex = currentQuiz[questionIndex].correct;
        const options = document.querySelectorAll(`[data-question="${questionIndex}"]`);
        
        options[correctIndex].classList.add('correct');
        
        if (optionIndex !== correctIndex) {
            event.target.classList.add('incorrect');
        }
        
        // Check if all questions answered
        if (userAnswers.every(answer => answer !== null)) {
            setTimeout(showScore, 500);
        }
    }

    function showScore() {
        const correctCount = userAnswers.reduce((count, answer, index) => {
            return count + (answer === currentQuiz[index].correct ? 1 : 0);
        }, 0);
        
        const percentage = Math.round((correctCount / currentQuiz.length) * 100);
        
        finalScore.textContent = `You scored ${correctCount}/${currentQuiz.length} (${percentage}%)`;
        quizSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
    }

    function resetQuiz() {
        inputSection.classList.remove('hidden');
        quizSection.classList.add('hidden');
        resultSection.classList.add('hidden');
        hideError();
        notesTextarea.value = '';
        currentQuiz = [];
        userAnswers = [];
    }
});
