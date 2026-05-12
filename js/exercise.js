document.addEventListener("DOMContentLoaded", function () {
    if (!PyLearnApp.requireLogin()) {
        return;
    }

    let progress = PyLearnApp.ensureProgress();
    let selectedStageId = progress.selectedStageId;
    let stageStats = PyLearnApp.getStageStats(selectedStageId, progress);

    if (!stageStats.hasQuestions || !stageStats.unlocked) {
        selectedStageId = PyLearnApp.getFirstUnlockedPlayableStageId(progress);
        progress = PyLearnApp.setSelectedStage(selectedStageId);
        stageStats = PyLearnApp.getStageStats(selectedStageId, progress);
    }

    let stageQuestions = PyLearnApp.getQuestionsForStage(selectedStageId);
    let currentQuestionIndex = PyLearnApp.getCurrentQuestionIndex(selectedStageId);

    const stageName = document.getElementById("stageName");
    const questionCounter = document.getElementById("questionCounter");
    const questionTopic = document.getElementById("questionTopic");
    const questionIntro = document.getElementById("questionIntro");
    const difficultyBadge = document.getElementById("difficultyBadge");
    const xpRewardBadge = document.getElementById("xpRewardBadge");
    const questionText = document.getElementById("questionText");
    const optionsContainer = document.getElementById("optionsContainer");
    const practiceNote = document.getElementById("practiceNote");
    const quizForm = document.getElementById("quizForm");
    const submitAnswerBtn = document.getElementById("submitAnswerBtn");
    const previousQuestionBtn = document.getElementById("previousQuestionBtn");
    const nextQuestionBtn = document.getElementById("nextQuestionBtn");
    const feedbackBox = document.getElementById("feedbackBox");
    const feedbackTitle = document.getElementById("feedbackTitle");
    const feedbackText = document.getElementById("feedbackText");
    const xpSidebar = document.getElementById("xpSidebar");
    const levelSidebar = document.getElementById("levelSidebar");
    const streakSidebar = document.getElementById("streakSidebar");
    const completionSidebar = document.getElementById("completionSidebar");
    const questionTracker = document.getElementById("questionTracker");

    function getCurrentQuestion() {
        return stageQuestions[currentQuestionIndex];
    }

    function updateProgressSnapshot() {
        progress = PyLearnApp.getProgress();
        stageStats = PyLearnApp.getStageStats(selectedStageId, progress);
        stageQuestions = PyLearnApp.getQuestionsForStage(selectedStageId);
    }

    function showFeedback(title, type, text) {
        feedbackTitle.textContent = title;
        feedbackText.textContent = text;
        feedbackBox.className = `feedback-box ${type} show`;
    }

    function updateSidebar() {
        updateProgressSnapshot();
        xpSidebar.textContent = progress.totalXP;
        levelSidebar.textContent = progress.level;
        streakSidebar.textContent = progress.streak;
        completionSidebar.textContent = `${stageStats.answered}/${stageStats.total}`;
    }

    function renderTracker() {
        questionTracker.innerHTML = stageQuestions.map(function (question, index) {
            const answerState = PyLearnApp.getQuestionAnswerState(question.id, progress);
            const stateClass = answerState.status || "unanswered";
            const activeClass = index === currentQuestionIndex ? "active" : "";

            return `
                <button class="tracker-button ${stateClass} ${activeClass}" type="button" data-question-index="${index}" aria-label="Go to question ${index + 1}">
                    ${index + 1}
                </button>
            `;
        }).join("");
    }

    function renderSavedFeedback(question, answerState) {
        if (answerState.status === "correct") {
            showFeedback(
                "Correct answer saved.",
                "success",
                `${question.explanation} You earned XP on the first submission for this question.`
            );
            return;
        }

        if (answerState.status === "incorrect") {
            showFeedback(
                "First answer was incorrect.",
                "error",
                `${question.explanation} This question is locked for scoring, so changing it now will not award XP.`
            );
            return;
        }

        showFeedback(
            "Ready when you are",
            "info",
            "Select one option and submit your answer to see immediate feedback and explanations."
        );
    }

    function renderOptions(question, answerState) {
        const answered = answerState.status !== "unanswered";

        optionsContainer.innerHTML = question.options.map(function (option, index) {
            const optionLetter = String.fromCharCode(65 + index);
            const checked = answered && answerState.selectedIndex === index ? "checked" : "";
            const disabled = answered ? "disabled" : "";
            const selectedClass = answered && answerState.selectedIndex === index ? "selected-answer" : "";
            const disabledClass = answered ? "disabled-answer" : "";
            const correctnessClass = answered && answerState.selectedIndex === index
                ? answerState.status
                : "";

            return `
                <label class="option-label ${selectedClass} ${correctnessClass} ${disabledClass}">
                    <input type="radio" name="answer" value="${index}" ${checked} ${disabled}>
                    <span class="option-marker">${optionLetter}</span>
                    <span>${option}</span>
                </label>
            `;
        }).join("");
    }

    function loadQuestion() {
        updateProgressSnapshot();

        const currentStage = PyLearnApp.getStageById(selectedStageId);
        const currentQuestion = getCurrentQuestion();

        if (!currentQuestion) {
            questionText.textContent = "No questions are available for this stage yet.";
            practiceNote.textContent = "Return to the learning path and choose an unlocked stage.";
            optionsContainer.innerHTML = "";
            submitAnswerBtn.disabled = true;
            previousQuestionBtn.disabled = true;
            nextQuestionBtn.disabled = true;
            renderTracker();
            return;
        }

        const answerState = PyLearnApp.getQuestionAnswerState(currentQuestion.id, progress);
        const answered = answerState.status !== "unanswered";

        stageName.textContent = currentStage.title;
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${stageQuestions.length}`;
        questionTopic.textContent = currentQuestion.topic;
        questionIntro.textContent = currentQuestion.intro;
        difficultyBadge.textContent = currentQuestion.difficulty;
        difficultyBadge.className = `difficulty-badge ${currentQuestion.difficulty.toLowerCase()}`;
        xpRewardBadge.textContent = `+${currentQuestion.xpReward} XP`;
        questionText.textContent = currentQuestion.prompt;

        renderOptions(currentQuestion, answerState);

        practiceNote.textContent = answered
            ? "This question was already submitted. The saved first answer is shown for review."
            : "Only your first submitted answer counts for XP, so choose carefully.";

        submitAnswerBtn.disabled = answered;
        previousQuestionBtn.disabled = currentQuestionIndex === 0;
        nextQuestionBtn.disabled = currentQuestionIndex === stageQuestions.length - 1;

        PyLearnApp.setCurrentQuestionIndex(selectedStageId, currentQuestionIndex);
        renderTracker();
        renderSavedFeedback(currentQuestion, answerState);
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

        const currentQuestion = getCurrentQuestion();
        const selectedAnswerIndex = validateAnswer();

        if (!currentQuestion || selectedAnswerIndex === null) {
            return;
        }

        const result = PyLearnApp.submitQuestionAnswer(currentQuestion.id, selectedAnswerIndex);
        let feedbackTitleValue;
        let feedbackTypeValue;
        let feedbackTextValue;

        if (result.answerState.status === "correct") {
            const xpMessage = result.awarded
                ? `You earned ${currentQuestion.xpReward} XP.`
                : "No extra XP was awarded because this question was already answered.";

            feedbackTitleValue = "Correct! Great job.";
            feedbackTypeValue = "success";
            feedbackTextValue = `${currentQuestion.explanation} ${xpMessage}`;
        } else {
            feedbackTitleValue = "Not quite yet, but you are improving.";
            feedbackTypeValue = "error";
            feedbackTextValue = `${currentQuestion.explanation} This first answer is saved, so this question will not award XP later.`;
        }

        loadQuestion();
        showFeedback(feedbackTitleValue, feedbackTypeValue, feedbackTextValue);
    }

    function goToQuestion(index) {
        currentQuestionIndex = Math.max(0, Math.min(index, stageQuestions.length - 1));
        PyLearnApp.setCurrentQuestionIndex(selectedStageId, currentQuestionIndex);
        loadQuestion();
    }

    quizForm.addEventListener("submit", handleSubmit);

    previousQuestionBtn.addEventListener("click", function () {
        goToQuestion(currentQuestionIndex - 1);
    });

    nextQuestionBtn.addEventListener("click", function () {
        goToQuestion(currentQuestionIndex + 1);
    });

    questionTracker.addEventListener("click", function (event) {
        const trackerButton = event.target.closest(".tracker-button");

        if (!trackerButton) {
            return;
        }

        goToQuestion(Number(trackerButton.dataset.questionIndex));
    });

    loadQuestion();
});
