document.addEventListener("DOMContentLoaded", function () {
    if (!PyLearnApp.requireLogin()) {
        return;
    }

    const stages = PyLearnApp.COURSE_STAGES;
    const welcomeName = document.getElementById("welcomeName");
    const welcomeText = document.getElementById("welcomeText");
    const xpValue = document.getElementById("xpValue");
    const levelValue = document.getElementById("levelValue");
    const streakValue = document.getElementById("streakValue");
    const progressPercent = document.getElementById("progressPercent");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressSummary = document.getElementById("progressSummary");
    const missionText = document.getElementById("missionText");
    const stageMessage = document.getElementById("stageMessage");
    const stagesContainer = document.getElementById("stagesContainer");
    const continueLearningBtn = document.getElementById("continueLearningBtn");

    const user = PyLearnApp.getUser();
    let progress = PyLearnApp.ensureProgress();

    function showStageMessage(text, type) {
        stageMessage.textContent = text;
        stageMessage.className = `message ${type} show`;
    }

    function updateDashboard() {
        progress = PyLearnApp.getProgress();

        const displayName = PyLearnApp.getDisplayName(user);
        const overallStats = PyLearnApp.getOverallStats(progress);
        const completionPercent = PyLearnApp.getCompletionPercent(progress);
        const nextStageId = PyLearnApp.getFirstUnlockedPlayableStageId(progress);
        const nextStage = PyLearnApp.getStageById(nextStageId);

        welcomeName.textContent = displayName;
        welcomeText.textContent = `Welcome back, ${displayName}. Your current focus is ${nextStage.title}.`;
        xpValue.textContent = progress.totalXP;
        levelValue.textContent = progress.level;
        streakValue.textContent = progress.streak;
        progressPercent.textContent = `${completionPercent}%`;
        progressBarFill.style.width = `${completionPercent}%`;
        progressSummary.textContent = `${overallStats.answered} of ${overallStats.total} available questions answered`;

        missionText.textContent = overallStats.answered >= overallStats.total
            ? "Amazing work. You answered every available question, so now you can review any unlocked stage."
            : `Next up: ${nextStage.title}. Complete every question in the stage to unlock the next playable topic.`;
    }

    function getStatusLabel(status, stats) {
        if (!stats.hasQuestions) {
            return "Coming Soon";
        }

        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    function renderStages() {
        progress = PyLearnApp.getProgress();

        stagesContainer.innerHTML = stages.map(function (stage) {
            const stats = PyLearnApp.getStageStats(stage.id, progress);
            const status = PyLearnApp.getStageStatus(stage.id, progress);
            const isSelected = progress.selectedStageId === stage.id;
            const isLocked = status === "locked";
            const progressText = stats.hasQuestions
                ? `${stats.answered} / ${stats.total} questions answered`
                : "0 / 0 questions available";
            const actionText = isLocked
                ? "Locked"
                : stats.completed ? "Review" : "Start";

            return `
                <article class="stage-card ${status} ${isSelected ? "selected" : ""}" data-stage-id="${stage.id}" data-locked="${isLocked}">
                    <div class="stage-number stage-icon" aria-hidden="true">${stage.icon}</div>
                    <div class="stage-content">
                        <p class="stage-kicker">Stage ${stage.number}</p>
                        <h3>${stage.title}</h3>
                        <p class="stage-description">${stage.description}</p>
                        <div class="stage-progress-line">
                            <span>${progressText}</span>
                            <span>${stats.correct} correct</span>
                        </div>
                        <div class="stage-mini-progress" aria-label="${stage.title} progress">
                            <span style="width: ${stats.total > 0 ? Math.round((stats.answered / stats.total) * 100) : 0}%"></span>
                        </div>
                    </div>
                    <div class="stage-footer">
                        <span class="stage-status">${getStatusLabel(status, stats)}</span>
                        <span class="stage-link ${isLocked ? "disabled" : ""}">${actionText}</span>
                    </div>
                </article>
            `;
        }).join("");
    }

    function openStage(stageId) {
        const stats = PyLearnApp.getStageStats(stageId);
        const status = PyLearnApp.getStageStatus(stageId);

        if (status === "locked") {
            const message = stats.hasQuestions
                ? "That stage is locked. Finish the current unlocked stage first."
                : "That stage is prepared for future questions and is not available yet.";
            showStageMessage(message, "error");
            return;
        }

        PyLearnApp.setSelectedStage(stageId);
        PyLearnApp.setCurrentQuestionIndex(stageId, 0);
        window.location.href = "exercise.html";
    }

    stagesContainer.addEventListener("click", function (event) {
        const card = event.target.closest(".stage-card");

        if (!card) {
            return;
        }

        openStage(card.dataset.stageId);
    });

    continueLearningBtn.addEventListener("click", function (event) {
        event.preventDefault();
        openStage(PyLearnApp.getFirstUnlockedPlayableStageId(PyLearnApp.getProgress()));
    });

    updateDashboard();
    renderStages();
});
