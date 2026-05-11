document.addEventListener("DOMContentLoaded", function () {
    const questions = [
        {
            id: "q1",
            topic: "Python Basics",
            intro: "This topic introduces the basic syntax used to display text in Python.",
            prompt: "What is the correct way to print text in Python?",
            options: [
                'echo("Hello")',
                'print("Hello")',
                'console.log("Hello")',
                'write("Hello")'
            ],
            correctAnswer: 1,
            explanation: "Python uses the built-in print() function to display text on the screen."
        },
        {
            id: "q2",
            topic: "Variables and Syntax",
            intro: "Python comments help explain code without changing program behavior.",
            prompt: "Which symbol is used for comments in Python?",
            options: [
                "//",
                "<!-- -->",
                "#",
                "*"
            ],
            correctAnswer: 2,
            explanation: "Single-line comments in Python start with the # symbol."
        },
        {
            id: "q3",
            topic: "Conditions and Data Types",
            intro: "Boolean values are important for conditions and comparisons in Python.",
            prompt: "Which data type is used for True or False values?",
            options: [
                "string",
                "boolean",
                "integer",
                "list"
            ],
            correctAnswer: 1,
            explanation: "Boolean values represent True or False and are commonly used in conditions."
        },
        {
            id: "q4",
            topic: "Operators",
            intro: "Order of operations matters in Python expressions, just like in mathematics.",
            prompt: "What is the result of 3 + 2 * 2?",
            options: [
                "10",
                "7",
                "12",
                "5"
            ],
            correctAnswer: 1,
            explanation: "Multiplication happens before addition, so Python calculates 2 * 2 first, then adds 3."
        },
        {
            id: "q5",
            topic: "Functions",
            intro: "Functions help you group instructions into reusable blocks of code.",
            prompt: "Which keyword is used to define a function in Python?",
            options: [
                "function",
                "define",
                "def",
                "func"
            ],
            correctAnswer: 2,
            explanation: "The def keyword starts a function definition in Python."
        }
    ];

    const questionCounter = document.getElementById("questionCounter");
    const questionTopic = document.getElementById("questionTopic");
    const questionIntro = document.getElementById("questionIntro");
    const questionText = document.getElementById("questionText");
    const optionsContainer = document.getElementById("optionsContainer");
    const practiceNote = document.getElementById("practiceNote");
    const quizForm = document.getElementById("quizForm");
    const nextQuestionBtn = document.getElementById("nextQuestionBtn");
    const feedbackBox = document.getElementById("feedbackBox");
    const feedbackTitle = document.getElementById("feedbackTitle");
    const feedbackText = document.getElementById("feedbackText");
    const xpSidebar = document.getElementById("xpSidebar");
    const levelSidebar = document.getElementById("levelSidebar");
    const streakSidebar = document.getElementById("streakSidebar");
    const completionSidebar = document.getElementById("completionSidebar");

    let progress = PyLearnApp.ensureProgress();
    let currentQuestionIndex = resolveInitialQuestionIndex(progress);

    function resolveInitialQuestionIndex(savedProgress) {
        const storedIndex = Number(savedProgress.currentQuestionIndex);

        if (!Number.isNaN(storedIndex) && storedIndex >= 0 && storedIndex < questions.length) {
            return storedIndex;
        }

        return Math.max(0, Math.min((savedProgress.selectedStage || 1) - 1, questions.length - 1));
    }

    function updateSidebar() {
        progress = PyLearnApp.getProgress();
        xpSidebar.textContent = progress.xp;
        levelSidebar.textContent = progress.level;
        streakSidebar.textContent = progress.streak;
        completionSidebar.textContent = `${progress.completedQuestions.length}/${questions.length}`;
    }

    function showFeedback(title, type, text) {
        feedbackTitle.textContent = title;
        feedbackText.textContent = text;
        feedbackBox.className = `feedback-box ${type} show`;
    }

    function loadQuestion() {
        progress = PyLearnApp.getProgress();

        const currentQuestion = questions[currentQuestionIndex];
        const alreadyCompleted = progress.completedQuestions.includes(currentQuestion.id);

        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        questionTopic.textContent = currentQuestion.topic;
        questionIntro.textContent = currentQuestion.intro;
        questionText.textContent = currentQuestion.prompt;

        optionsContainer.innerHTML = currentQuestion.options.map(function (option, index) {
            const optionLetter = String.fromCharCode(65 + index);

            return `
                <label class="option-label">
                    <input type="radio" name="answer" value="${index}">
                    <span class="option-marker">${optionLetter}</span>
                    <span>${option}</span>
                </label>
            `;
        }).join("");

        practiceNote.textContent = alreadyCompleted
            ? "You already completed this question once. You can review it again, but it will not award extra XP."
            : "Choose one answer and submit to earn XP and keep your streak active.";

        nextQuestionBtn.textContent = currentQuestionIndex === questions.length - 1
            ? "Restart Quiz"
            : "Next Question";

        PyLearnApp.setCurrentQuestionIndex(currentQuestionIndex);
        PyLearnApp.setSelectedStage(currentQuestionIndex + 1);
        updateSidebar();
    }

    function validateAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');

        if (!selectedAnswer) {
            showFeedback(
                "Please select an answer before submitting.",
                "error",
                "Choose one of the four options and then submit your answer."
            );
            return null;
        }

        return Number(selectedAnswer.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const selectedAnswerIndex = validateAnswer();

        if (selectedAnswerIndex === null) {
            return;
        }

        progress = PyLearnApp.registerDailyActivity(PyLearnApp.getProgress());

        const currentQuestion = questions[currentQuestionIndex];

        if (selectedAnswerIndex === currentQuestion.correctAnswer) {
            const awardResult = PyLearnApp.awardXp(currentQuestion.id, 10);
            progress = awardResult.progress;

            const xpMessage = awardResult.awarded
                ? "You earned 10 XP for this question."
                : "This question was already completed earlier, so this attempt counts as practice only.";

            showFeedback(
                "Correct! Great job.",
                "success",
                `${currentQuestion.explanation} ${xpMessage}`
            );
        } else {
            progress = PyLearnApp.getProgress();
            showFeedback(
                "Not quite yet, but you are improving.",
                "error",
                `${currentQuestion.explanation} Review the idea and try the next challenge.`
            );
        }

        updateSidebar();
    }

    function nextQuestion() {
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        currentQuestionIndex = isLastQuestion ? 0 : currentQuestionIndex + 1;

        loadQuestion();

        if (isLastQuestion) {
            showFeedback(
                "You reached the end of the quiz set.",
                "info",
                "The questions have restarted so you can review and strengthen your Python basics."
            );
        } else {
            showFeedback(
                "New question loaded.",
                "info",
                "Read carefully and submit the answer that best matches the Python concept."
            );
        }
    }

    quizForm.addEventListener("submit", handleSubmit);
    nextQuestionBtn.addEventListener("click", nextQuestion);

    loadQuestion();
});
