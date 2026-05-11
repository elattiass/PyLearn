(function () {
    const STORAGE_KEYS = {
        user: "pylearn_user",
        progress: "pylearn_progress"
    };

    const TOTAL_QUESTIONS = 5;

    const DEFAULT_PROGRESS = {
        xp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: "",
        completedQuestions: [],
        currentQuestionIndex: 0,
        selectedStage: 1
    };

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getLocalDateString(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function readStorage(key, fallbackValue) {
        try {
            const rawValue = localStorage.getItem(key);
            return rawValue ? JSON.parse(rawValue) : fallbackValue;
        } catch (error) {
            return fallbackValue;
        }
    }

    function writeStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function calculateLevel(xp) {
        const safeXp = Math.max(0, Number(xp) || 0);
        return Math.floor(safeXp / 20) + 1;
    }

    function sanitizeProgress(progress) {
        const safeProgress = {
            ...DEFAULT_PROGRESS,
            ...(progress || {})
        };

        safeProgress.xp = Math.max(0, Number(safeProgress.xp) || 0);
        safeProgress.level = calculateLevel(safeProgress.xp);
        safeProgress.streak = Math.max(0, Number(safeProgress.streak) || 0);
        safeProgress.lastActiveDate = typeof safeProgress.lastActiveDate === "string"
            ? safeProgress.lastActiveDate
            : "";
        safeProgress.completedQuestions = Array.isArray(safeProgress.completedQuestions)
            ? [...new Set(safeProgress.completedQuestions.map(String))].slice(0, TOTAL_QUESTIONS)
            : [];
        safeProgress.currentQuestionIndex = clamp(
            Number(safeProgress.currentQuestionIndex) || 0,
            0,
            TOTAL_QUESTIONS - 1
        );
        safeProgress.selectedStage = clamp(
            Number(safeProgress.selectedStage) || 1,
            1,
            TOTAL_QUESTIONS
        );

        return safeProgress;
    }

    function getProgress() {
        return sanitizeProgress(readStorage(STORAGE_KEYS.progress, DEFAULT_PROGRESS));
    }

    function saveProgress(progress) {
        const safeProgress = sanitizeProgress(progress);
        writeStorage(STORAGE_KEYS.progress, safeProgress);
        return safeProgress;
    }

    function ensureProgress() {
        return saveProgress(getProgress());
    }

    function getUser() {
        return readStorage(STORAGE_KEYS.user, null);
    }

    function setUser(user) {
        writeStorage(STORAGE_KEYS.user, user);
        return user;
    }

    function getDisplayName(user) {
        if (!user || !user.email) {
            return "Guest Learner";
        }

        return user.email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .split(" ")
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }

    function getCompletionPercent(progress) {
        const safeProgress = sanitizeProgress(progress);
        return Math.round((safeProgress.completedQuestions.length / TOTAL_QUESTIONS) * 100);
    }

    function registerDailyActivity(progress) {
        const safeProgress = sanitizeProgress(progress);
        const today = getLocalDateString();

        if (!safeProgress.lastActiveDate) {
            safeProgress.streak = 1;
            safeProgress.lastActiveDate = today;
            return saveProgress(safeProgress);
        }

        if (safeProgress.lastActiveDate === today) {
            return saveProgress(safeProgress);
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (safeProgress.lastActiveDate === getLocalDateString(yesterday)) {
            safeProgress.streak += 1;
        } else {
            safeProgress.streak = 1;
        }

        safeProgress.lastActiveDate = today;
        return saveProgress(safeProgress);
    }

    function awardXp(questionId, amount) {
        const safeProgress = getProgress();
        const normalizedQuestionId = String(questionId);

        if (safeProgress.completedQuestions.includes(normalizedQuestionId)) {
            return {
                progress: safeProgress,
                awarded: false
            };
        }

        safeProgress.xp += amount;
        safeProgress.level = calculateLevel(safeProgress.xp);
        safeProgress.completedQuestions.push(normalizedQuestionId);
        safeProgress.selectedStage = clamp(safeProgress.completedQuestions.length + 1, 1, TOTAL_QUESTIONS);
        safeProgress.currentQuestionIndex = clamp(
            safeProgress.completedQuestions.length,
            0,
            TOTAL_QUESTIONS - 1
        );

        return {
            progress: saveProgress(safeProgress),
            awarded: true
        };
    }

    function setCurrentQuestionIndex(index) {
        const safeProgress = getProgress();
        safeProgress.currentQuestionIndex = clamp(Number(index) || 0, 0, TOTAL_QUESTIONS - 1);
        return saveProgress(safeProgress);
    }

    function setSelectedStage(stageNumber) {
        const safeProgress = getProgress();
        safeProgress.selectedStage = clamp(Number(stageNumber) || 1, 1, TOTAL_QUESTIONS);
        return saveProgress(safeProgress);
    }

    window.PyLearnApp = {
        STORAGE_KEYS,
        TOTAL_QUESTIONS,
        getLocalDateString,
        getUser,
        setUser,
        getDisplayName,
        getProgress,
        saveProgress,
        ensureProgress,
        calculateLevel,
        getCompletionPercent,
        registerDailyActivity,
        awardXp,
        setCurrentQuestionIndex,
        setSelectedStage
    };
})();
