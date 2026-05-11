document.addEventListener("DOMContentLoaded", function () {
    const stages = [
        {
            id: 1,
            title: "Python Basics",
            description: "Start with Python syntax, printing text, and simple rules."
        },
        {
            id: 2,
            title: "Variables",
            description: "Understand how Python stores values using variable names."
        },
        {
            id: 3,
            title: "Conditions",
            description: "Explore how if statements help programs make decisions."
        },
        {
            id: 4,
            title: "Loops",
            description: "Practice repeating actions using Python loops."
        },
        {
            id: 5,
            title: "Functions",
            description: "Learn how reusable functions organize Python code."
        }
    ];

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

    function getStageStatus(index) {
        const completedCount = progress.completedQuestions.length;

        if (index < completedCount) {
            return "completed";
        }

        if (index === completedCount && completedCount < stages.length) {
            return "current";
        }

        return "locked";
    }

    function updateDashboard() {
        progress = PyLearnApp.getProgress();

        const displayName = PyLearnApp.getDisplayName(user);
        const completedCount = progress.completedQuestions.length;
        const completionPercent = PyLearnApp.getCompletionPercent(progress);
        const nextStageIndex = Math.min(completedCount, stages.length - 1);
        const nextStage = stages[nextStageIndex];

        welcomeName.textContent = displayName;
        welcomeText.textContent = user
            ? `Welcome back, ${displayName}. Your current focus is ${nextStage.title}.`
            : "You are exploring as a guest. Log in to personalize your progress and streak.";

        xpValue.textContent = progress.xp;
        levelValue.textContent = progress.level;
        streakValue.textContent = progress.streak;
        progressPercent.textContent = `${completionPercent}%`;
        progressBarFill.style.width = `${completionPercent}%`;
        progressSummary.textContent = `${completedCount} of ${stages.length} stages completed`;

        missionText.textContent = completedCount >= stages.length
            ? "Amazing work. You completed every current stage, so now you can review and strengthen your skills."
            : `Next up: ${nextStage.title}. Answer the exercise to unlock more of the learning path.`;
    }

    function renderStages() {
        progress = PyLearnApp.getProgress();

        stagesContainer.innerHTML = stages.map(function (stage, index) {
            const status = getStageStatus(index);
            const isSelected = progress.selectedStage === stage.id;
            const isLocked = status === "locked";
            const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

            return `
                <article class="stage-card ${status} ${isSelected ? "selected" : ""}" data-stage-id="${stage.id}" data-locked="${isLocked}">
                    <div class="stage-number">${stage.id}</div>
                    <h3>${stage.title}</h3>
                    <p class="stage-description">${stage.description}</p>
                    <div class="stage-footer">
                        <span class="stage-status">${statusLabel}</span>
                        ${isLocked
                            ? '<span class="stage-link disabled">Locked</span>'
                            : '<a class="stage-link" href="exercise.html">Open Exercise</a>'}
                    </div>
                </article>
            `;
        }).join("");
    }

    stagesContainer.addEventListener("click", function (event) {
        const card = event.target.closest(".stage-card");

        if (!card) {
            return;
        }

        const stageId = Number(card.dataset.stageId);
        const isLocked = card.dataset.locked === "true";

        if (isLocked) {
            showStageMessage("That stage is still locked. Complete the earlier topic first.", "error");
            return;
        }

        PyLearnApp.setSelectedStage(stageId);
        PyLearnApp.setCurrentQuestionIndex(stageId - 1);
        progress = PyLearnApp.getProgress();
        renderStages();

        showStageMessage(
            `${stages[stageId - 1].title} is selected. Open the exercise page to continue learning.`,
            "success"
        );
    });

    continueLearningBtn.addEventListener("click", function () {
        progress = PyLearnApp.getProgress();
        const nextStage = Math.min(progress.completedQuestions.length + 1, stages.length);
        PyLearnApp.setSelectedStage(nextStage);
        PyLearnApp.setCurrentQuestionIndex(nextStage - 1);
    });

    updateDashboard();
    renderStages();
});
