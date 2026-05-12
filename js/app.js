(function () {
    const STORAGE_KEYS = {
        user: "pylearn_user",
        progress: "pylearn_progress",
        selectedStage: "pylearnSelectedStage",
        isLoggedIn: "isLoggedIn"
    };

    const COURSE_STAGES = [
        {
            id: "basics",
            number: 1,
            title: "Python Basics",
            icon: "🐣",
            description: "Start with Python syntax, printing text, comments, and simple calculations."
        },
        {
            id: "variables",
            number: 2,
            title: "Variables",
            icon: "📦",
            description: "Practice storing values, naming variables, and using basic data types."
        },
        {
            id: "conditions",
            number: 3,
            title: "Conditions",
            icon: "🔀",
            description: "Use boolean values and decision logic to guide program behavior."
        },
        {
            id: "loops",
            number: 4,
            title: "Loops",
            icon: "🔁",
            description: "Prepare for repeated actions with for loops, while loops, and range()."
        },
        {
            id: "functions",
            number: 5,
            title: "Functions",
            icon: "🧩",
            description: "Learn how reusable functions organize Python programs."
        }
    ];

    const RAW_QUESTION_DATA = [
        {
            question_id: 1,
            level: 1,
            question_text: "What will be printed by the following code?\n\nprint(4 + 3 % 5)",
            options: { A: "7", B: "2", C: "4", D: "1" },
            correct_answer: "A",
            explanation: "The modulo operation is evaluated first: 3 % 5 equals 3, so 4 + 3 equals 7."
        },
        {
            question_id: 2,
            level: 1,
            question_text: "Which symbol is used to define a code block in Python?",
            options: { A: "Curly brackets {}", B: "Indentation", C: "Parentheses ()", D: "Semicolon ;" },
            correct_answer: "B",
            explanation: "Python uses indentation to define code blocks."
        },
        {
            question_id: 3,
            level: 1,
            question_text: "Which keyword is used to define a function in Python?",
            options: { A: "function", B: "define", C: "def", D: "func" },
            correct_answer: "C",
            explanation: "The def keyword is used to define a function in Python."
        },
        {
            question_id: 4,
            level: 1,
            question_text: "What will be printed by the following code?\n\nx = [10, 20, 30]\nprint(x[1])",
            options: { A: "10", B: "20", C: "30", D: "Error" },
            correct_answer: "B",
            explanation: "List indexing starts at 0, so x[1] is the second element: 20."
        },
        {
            question_id: 5,
            level: 1,
            question_text: "What will be printed by the following code?\n\nname = 'Python'\nprint(name[0])",
            options: { A: "P", B: "y", C: "Python", D: "Error" },
            correct_answer: "A",
            explanation: "String indexing starts at 0, so name[0] is 'P'."
        },
        {
            question_id: 6,
            level: 1,
            question_text: "Which option correctly adds the value 4 to the end of this list?\n\nnumbers = [1, 2, 3]",
            options: { A: "numbers.add(4)", B: "numbers.append(4)", C: "numbers.insert_end(4)", D: "numbers.push(4)" },
            correct_answer: "B",
            explanation: "append() adds an element to the end of a list."
        },
        {
            question_id: 7,
            level: 1,
            question_text: "What will be printed by the following code?\n\nx = 5\nif x > 3:\n    print('big')\nelse:\n    print('small')",
            options: { A: "big", B: "small", C: "True", D: "Error" },
            correct_answer: "A",
            explanation: "Since 5 is greater than 3, the if block runs."
        },
        {
            question_id: 8,
            level: 1,
            question_text: "What is the purpose of the == operator in Python?",
            options: { A: "To assign a value", B: "To compare two values", C: "To create a variable", D: "To add two values" },
            correct_answer: "B",
            explanation: "== checks whether two values are equal."
        },
        {
            question_id: 9,
            level: 1,
            question_text: "Which option correctly creates a list in Python?",
            options: { A: "numbers = (1, 2, 3)", B: "numbers = {1, 2, 3}", C: "numbers = [1, 2, 3]", D: "numbers = <1, 2, 3>" },
            correct_answer: "C",
            explanation: "Lists are created using square brackets."
        },
        {
            question_id: 10,
            level: 1,
            question_text: "What will be printed by the following code?\n\nprint(10 // 3)",
            options: { A: "3.33", B: "3", C: "1", D: "Error" },
            correct_answer: "B",
            explanation: "// performs floor division and returns the integer part."
        },
        {
            question_id: 11,
            level: 2,
            question_text: "What will be printed by the following code?\n\nfor i in [1, 2, 3, 4][::-1]:\n    print(i, end=' ')",
            options: { A: "1 2 3 4", B: "4 3 2 1", C: "1 3 2 4", D: "Error" },
            correct_answer: "B",
            explanation: "[::-1] reverses the list."
        },
        {
            question_id: 12,
            level: 2,
            question_text: "What will be printed by the following code?\n\nlist1 = [1, 3]\nlist2 = list1\nlist1[0] = 4\nprint(list2)",
            options: { A: "[1, 3]", B: "[4, 3]", C: "[1, 4]", D: "Error" },
            correct_answer: "B",
            explanation: "list2 refers to the same list object as list1."
        },
        {
            question_id: 13,
            level: 2,
            question_text: "What will be printed by the following code?\n\nitems = [1, 0, 2, '', [], 'hello']\nprint(list(filter(bool, items)))",
            options: { A: "[1, 0, 2, '', [], 'hello']", B: "[0, '', []]", C: "[1, 2, 'hello']", D: "Error" },
            correct_answer: "C",
            explanation: "filter(bool, items) keeps only truthy values."
        },
        {
            question_id: 14,
            level: 2,
            question_text: "Which statement best describes the difference between a list and a tuple?",
            options: { A: "Lists are immutable, tuples are mutable", B: "Lists are mutable, tuples are immutable", C: "Both lists and tuples are immutable", D: "Tuples can only store numbers" },
            correct_answer: "B",
            explanation: "Lists can be changed after creation, while tuples cannot."
        },
        {
            question_id: 15,
            level: 2,
            question_text: "What will be printed by the following code?\n\ntext = 'hello'\nprint(text.upper())",
            options: { A: "hello", B: "HELLO", C: "Hello", D: "Error" },
            correct_answer: "B",
            explanation: "upper() converts all letters to uppercase."
        },
        {
            question_id: 16,
            level: 2,
            question_text: "Which option correctly creates a list of squares from 1 to 5?",
            options: { A: "[x * x for x in range(1, 6)]", B: "[x + x for x in range(1, 6)]", C: "[x * x in range(1, 6)]", D: "for x in range(1, 6): x * x" },
            correct_answer: "A",
            explanation: "This is the correct list comprehension syntax for squares."
        },
        {
            question_id: 17,
            level: 2,
            question_text: "What is the main purpose of a dictionary in Python?",
            options: { A: "To store values by index only", B: "To store key-value pairs", C: "To store only unique values", D: "To store values in sorted order only" },
            correct_answer: "B",
            explanation: "A dictionary stores data as key-value pairs."
        },
        {
            question_id: 18,
            level: 2,
            question_text: "What will be printed by the following code?\n\nstudent = {'name': 'Dana', 'grade': 95}\nprint(student['name'])",
            options: { A: "Dana", B: "name", C: "95", D: "Error" },
            correct_answer: "A",
            explanation: "The key 'name' maps to the value 'Dana'."
        },
        {
            question_id: 19,
            level: 2,
            question_text: "Which method returns all key-value pairs from a dictionary?",
            options: { A: "keys()", B: "values()", C: "items()", D: "pairs()" },
            correct_answer: "C",
            explanation: "items() returns the dictionary's key-value pairs."
        },
        {
            question_id: 20,
            level: 2,
            question_text: "What will be printed by the following code?\n\nx = 10\n\ndef change():\n    x = 5\n    print(x)\n\nchange()\nprint(x)",
            options: { A: "5 then 5", B: "10 then 10", C: "5 then 10", D: "10 then 5" },
            correct_answer: "C",
            explanation: "The x inside the function is local, so the global x remains 10."
        },
        {
            question_id: 21,
            level: 3,
            question_text: "What will be printed by the following code?\n\nprint(2 ** 3 ** 2)",
            options: { A: "64", B: "512", C: "256", D: "Error" },
            correct_answer: "B",
            explanation: "Exponentiation is evaluated from right to left: 2 ** (3 ** 2)."
        },
        {
            question_id: 22,
            level: 3,
            question_text: "Which statement best describes a shallow copy?",
            options: { A: "It copies the outer object but keeps references to nested objects", B: "It copies all nested objects completely", C: "It deletes the original object", D: "It works only on strings" },
            correct_answer: "A",
            explanation: "A shallow copy creates a new outer object but shares nested objects."
        },
        {
            question_id: 23,
            level: 3,
            question_text: "What will be printed by the following code?\n\na = [[1, 2], [3, 4]]\nb = a.copy()\nb[0][0] = 99\nprint(a)",
            options: { A: "[[1, 2], [3, 4]]", B: "[[99, 2], [3, 4]]", C: "[[1, 99], [3, 4]]", D: "Error" },
            correct_answer: "B",
            explanation: "a.copy() is shallow, so the nested lists are still shared."
        },
        {
            question_id: 24,
            level: 3,
            question_text: "Which option best describes a lambda function in Python?",
            options: { A: "A loop that runs forever", B: "A small anonymous function", C: "A function that must contain many statements", D: "A special type of list" },
            correct_answer: "B",
            explanation: "lambda creates a small anonymous function."
        },
        {
            question_id: 25,
            level: 3,
            question_text: "What will be printed by the following code?\n\nnums = [1, 2, 3, 4]\nresult = list(map(lambda x: x * 2, nums))\nprint(result)",
            options: { A: "[1, 2, 3, 4]", B: "[2, 4, 6, 8]", C: "[1, 4, 9, 16]", D: "Error" },
            correct_answer: "B",
            explanation: "map applies the lambda function to every element."
        },
        {
            question_id: 26,
            level: 3,
            question_text: "Which statement about map(), filter(), and reduce() is correct?",
            options: { A: "map transforms values, filter selects values, and reduce combines values", B: "map deletes values, filter sorts values, and reduce prints values", C: "map works only on dictionaries", D: "filter always returns all elements" },
            correct_answer: "A",
            explanation: "map transforms, filter selects, and reduce combines elements into one result."
        },
        {
            question_id: 27,
            level: 3,
            question_text: "What will be printed by the following code?\n\ndef func(*args, **kwargs):\n    print(args)\n    print(kwargs)\n\nfunc(1, 2, name='Dana', age=20)",
            options: { A: "(1, 2) and {'name': 'Dana', 'age': 20}", B: "[1, 2] and ['Dana', 20]", C: "{1, 2} and ('name', 'age')", D: "Error" },
            correct_answer: "A",
            explanation: "*args stores positional arguments in a tuple, and **kwargs stores keyword arguments in a dictionary."
        },
        {
            question_id: 28,
            level: 3,
            question_text: "Which option best describes recursion?",
            options: { A: "A function calling itself", B: "A loop that must use while", C: "A way to create a dictionary", D: "A method for sorting strings only" },
            correct_answer: "A",
            explanation: "Recursion means a function calls itself to solve a problem."
        },
        {
            question_id: 29,
            level: 3,
            question_text: "Which statement best describes try, except, and finally in Python?",
            options: { A: "try runs code, except handles errors, and finally runs at the end", B: "try creates a function, except deletes it, and finally prints it", C: "try is used only for loops", D: "finally runs only if there is an error" },
            correct_answer: "A",
            explanation: "try contains risky code, except handles exceptions, and finally runs after the block."
        },
        {
            question_id: 30,
            level: 3,
            question_text: "Which statement best describes the difference between a class and an object?",
            options: { A: "A class is a blueprint, and an object is an instance of that class", B: "An object is a blueprint, and a class is an instance", C: "A class can store only numbers", D: "Objects are used only inside loops" },
            correct_answer: "A",
            explanation: "A class defines the structure, and an object is a specific instance created from it."
        }
    ];

    const OPTION_LETTERS = ["A", "B", "C", "D"];
    const DIFFICULTY_BY_LEVEL = { 1: "Easy", 2: "Medium", 3: "Hard" };
    const XP_BY_LEVEL = { 1: 5, 2: 10, 3: 15 };
    const STAGE_BY_QUESTION_ID = {
        1: "basics",
        2: "basics",
        3: "functions",
        4: "variables",
        5: "variables",
        6: "variables",
        7: "conditions",
        8: "basics",
        9: "variables",
        10: "basics",
        11: "loops",
        12: "variables",
        13: "conditions",
        14: "variables",
        15: "variables",
        16: "loops",
        17: "variables",
        18: "variables",
        19: "variables",
        20: "functions",
        21: "basics",
        22: "loops",
        23: "loops",
        24: "functions",
        25: "functions",
        26: "loops",
        27: "functions",
        28: "functions",
        29: "conditions",
        30: "functions"
    };
    const TOPIC_BY_QUESTION_ID = {
        1: "Modulo and arithmetic",
        2: "Indentation",
        3: "Function definitions",
        4: "List indexing",
        5: "String indexing",
        6: "List append",
        7: "if / else",
        8: "Comparison operators",
        9: "List syntax",
        10: "Floor division",
        11: "Reversed iteration",
        12: "List references",
        13: "filter() and truthy values",
        14: "Lists and tuples",
        15: "String methods",
        16: "List comprehensions",
        17: "Dictionaries",
        18: "Dictionary access",
        19: "Dictionary methods",
        20: "Function scope",
        21: "Exponentiation",
        22: "Shallow copy",
        23: "Nested lists",
        24: "Lambda functions",
        25: "map()",
        26: "map/filter/reduce",
        27: "*args and **kwargs",
        28: "Recursion",
        29: "Exceptions",
        30: "Classes and objects"
    };

    const QUESTION_BANK = RAW_QUESTION_DATA.map(function (question) {
        return {
            id: `q${question.question_id}`,
            sourceQuestionId: question.question_id,
            stageId: STAGE_BY_QUESTION_ID[question.question_id],
            topic: TOPIC_BY_QUESTION_ID[question.question_id],
            difficulty: DIFFICULTY_BY_LEVEL[question.level],
            xpReward: XP_BY_LEVEL[question.level],
            intro: `Level ${question.level} Python practice focused on ${TOPIC_BY_QUESTION_ID[question.question_id].toLowerCase()}.`,
            prompt: question.question_text,
            options: OPTION_LETTERS.map(function (letter) {
                return question.options[letter];
            }),
            correctAnswer: OPTION_LETTERS.indexOf(question.correct_answer),
            explanation: question.explanation
        };
    });

    const TOTAL_QUESTIONS = QUESTION_BANK.length;

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

    function isLoggedIn() {
        return localStorage.getItem(STORAGE_KEYS.isLoggedIn) === "true";
    }

    function getUserEmailKey(user = getUser()) {
        if (!user || !user.email) {
            return "";
        }

        return encodeURIComponent(user.email.trim().toLowerCase());
    }

    function getProgressStorageKey() {
        const emailKey = getUserEmailKey();
        return emailKey ? `${STORAGE_KEYS.progress}_${emailKey}` : STORAGE_KEYS.progress;
    }

    function getSelectedStageStorageKey() {
        const emailKey = getUserEmailKey();
        return emailKey ? `${STORAGE_KEYS.selectedStage}_${emailKey}` : STORAGE_KEYS.selectedStage;
    }

    function calculateLevel(xp) {
        const safeXp = Math.max(0, Number(xp) || 0);
        return Math.floor(safeXp / 20) + 1;
    }

    function getStageById(stageId) {
        return COURSE_STAGES.find(function (stage) {
            return stage.id === stageId || stage.number === Number(stageId);
        }) || COURSE_STAGES[0];
    }

    function getQuestionById(questionId) {
        return QUESTION_BANK.find(function (question) {
            return question.id === questionId;
        }) || null;
    }

    function getQuestionsForStage(stageId) {
        return QUESTION_BANK.filter(function (question) {
            return question.stageId === stageId;
        });
    }

    function createStageProgress() {
        return COURSE_STAGES.reduce(function (stages, stage) {
            stages[stage.id] = {
                unlocked: false,
                completed: false,
                answeredQuestions: {}
            };
            return stages;
        }, {});
    }

    function createDefaultProgress() {
        return {
            totalXP: 0,
            xp: 0,
            level: 1,
            streak: 0,
            lastActiveDate: "",
            selectedStageId: "basics",
            selectedStage: 1,
            earnedQuestionIds: [],
            currentQuestionByStage: {},
            stages: createStageProgress()
        };
    }

    function normalizeStageId(stageValue) {
        if (typeof stageValue === "string" && COURSE_STAGES.some((stage) => stage.id === stageValue)) {
            return stageValue;
        }

        const stageNumber = Number(stageValue);
        const stage = COURSE_STAGES.find(function (item) {
            return item.number === stageNumber;
        });

        return stage ? stage.id : "basics";
    }

    function sanitizeAnswerState(answerState, question) {
        if (!answerState || typeof answerState !== "object") {
            return null;
        }

        const selectedIndex = Number(answerState.selectedIndex);

        if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= question.options.length) {
            return null;
        }

        const status = answerState.status === "correct" || answerState.status === "incorrect"
            ? answerState.status
            : selectedIndex === question.correctAnswer ? "correct" : "incorrect";

        return {
            status: status,
            selectedIndex: selectedIndex,
            firstAttemptCorrect: typeof answerState.firstAttemptCorrect === "boolean"
                ? answerState.firstAttemptCorrect
                : status === "correct",
            xpAwarded: Boolean(answerState.xpAwarded),
            answeredAt: typeof answerState.answeredAt === "string"
                ? answerState.answeredAt
                : new Date().toISOString()
        };
    }

    function migrateCompletedQuestions(progress, completedQuestions) {
        if (!Array.isArray(completedQuestions)) {
            return;
        }

        // Keep progress from the old one-list model when users already have localStorage data.
        completedQuestions.forEach(function (questionId) {
            const question = getQuestionById(String(questionId));

            if (!question) {
                return;
            }

            const stageProgress = progress.stages[question.stageId];

            if (!stageProgress.answeredQuestions[question.id]) {
            stageProgress.answeredQuestions[question.id] = {
                    status: "correct",
                    selectedIndex: question.correctAnswer,
                    firstAttemptCorrect: true,
                    xpAwarded: true,
                    answeredAt: new Date().toISOString()
                };
                if (!progress.earnedQuestionIds.includes(question.id)) {
                    progress.earnedQuestionIds.push(question.id);
                }
            }
        });
    }

    function recalculateStageLocks(progress) {
        let previousPlayableCompleted = true;

        // Empty future stages stay visible but locked until questions are added.
        COURSE_STAGES.forEach(function (stage) {
            const stageProgress = progress.stages[stage.id];
            const stageQuestions = getQuestionsForStage(stage.id);
            const totalQuestions = stageQuestions.length;
            const answeredCount = stageQuestions.filter(function (question) {
                return Boolean(stageProgress.answeredQuestions[question.id]);
            }).length;

            stageProgress.completed = totalQuestions > 0 && answeredCount === totalQuestions;
            stageProgress.unlocked = totalQuestions > 0 && previousPlayableCompleted;

            if (totalQuestions > 0) {
                previousPlayableCompleted = stageProgress.completed;
            }
        });

        return progress;
    }

    function getFirstUnlockedPlayableStageId(progress) {
        const safeProgress = progress || getProgress();
        const unlockedIncomplete = COURSE_STAGES.find(function (stage) {
            const stats = getStageStats(stage.id, safeProgress);
            return stats.hasQuestions && stats.unlocked && !stats.completed;
        });

        if (unlockedIncomplete) {
            return unlockedIncomplete.id;
        }

        const unlockedPlayable = COURSE_STAGES.find(function (stage) {
            const stats = getStageStats(stage.id, safeProgress);
            return stats.hasQuestions && stats.unlocked;
        });

        return unlockedPlayable ? unlockedPlayable.id : "basics";
    }

    function sanitizeProgress(progress) {
        const source = progress || {};
        const safeProgress = createDefaultProgress();
        const savedSelectedStage = localStorage.getItem(getSelectedStageStorageKey())
            || localStorage.getItem(STORAGE_KEYS.selectedStage);
        const incomingXP = Number.isFinite(Number(source.totalXP))
            ? Number(source.totalXP)
            : Number(source.xp);

        safeProgress.totalXP = Math.max(0, Number(incomingXP) || 0);
        safeProgress.xp = safeProgress.totalXP;
        safeProgress.level = calculateLevel(safeProgress.totalXP);
        safeProgress.streak = Math.max(0, Number(source.streak) || 0);
        safeProgress.lastActiveDate = typeof source.lastActiveDate === "string"
            ? source.lastActiveDate
            : "";
        safeProgress.earnedQuestionIds = Array.isArray(source.earnedQuestionIds)
            ? [...new Set(source.earnedQuestionIds.map(String))]
                .filter(function (questionId) {
                    return Boolean(getQuestionById(questionId));
                })
            : [];

        COURSE_STAGES.forEach(function (stage) {
            const sourceStage = source.stages && source.stages[stage.id] ? source.stages[stage.id] : {};
            const answeredQuestions = sourceStage.answeredQuestions || {};

            getQuestionsForStage(stage.id).forEach(function (question) {
                const cleanAnswerState = sanitizeAnswerState(answeredQuestions[question.id], question);

                if (cleanAnswerState) {
                    safeProgress.stages[stage.id].answeredQuestions[question.id] = cleanAnswerState;
                    if (cleanAnswerState.xpAwarded && !safeProgress.earnedQuestionIds.includes(question.id)) {
                        safeProgress.earnedQuestionIds.push(question.id);
                    }
                }
            });
        });

        migrateCompletedQuestions(safeProgress, source.completedQuestions);

        if (source.currentQuestionByStage && typeof source.currentQuestionByStage === "object") {
            COURSE_STAGES.forEach(function (stage) {
                const questionCount = getQuestionsForStage(stage.id).length;
                const index = Number(source.currentQuestionByStage[stage.id]);
                safeProgress.currentQuestionByStage[stage.id] = questionCount > 0
                    ? clamp(Number.isFinite(index) ? index : 0, 0, questionCount - 1)
                    : 0;
            });
        }

        const legacyStageId = normalizeStageId(source.selectedStageId || source.selectedStage || savedSelectedStage);
        const legacyQuestionIndex = Number(source.currentQuestionIndex);

        if (Number.isFinite(legacyQuestionIndex)) {
            const legacyStageQuestions = getQuestionsForStage(legacyStageId);
            safeProgress.currentQuestionByStage[legacyStageId] = legacyStageQuestions.length > 0
                ? clamp(legacyQuestionIndex, 0, legacyStageQuestions.length - 1)
                : 0;
        }

        recalculateStageLocks(safeProgress);

        const selectedStage = getStageById(legacyStageId);
        const selectedStats = getStageStats(selectedStage.id, safeProgress);
        safeProgress.selectedStageId = selectedStats.hasQuestions && selectedStats.unlocked
            ? selectedStage.id
            : getFirstUnlockedPlayableStageId(safeProgress);
        safeProgress.selectedStage = getStageById(safeProgress.selectedStageId).number;

        return safeProgress;
    }

    function getProgress() {
        const progressKey = getProgressStorageKey();
        const storedProgress = readStorage(progressKey, null);
        const fallbackProgress = progressKey !== STORAGE_KEYS.progress
            ? readStorage(STORAGE_KEYS.progress, null)
            : null;

        return sanitizeProgress(storedProgress || fallbackProgress || createDefaultProgress());
    }

    function saveProgress(progress) {
        const safeProgress = sanitizeProgress(progress);
        writeStorage(getProgressStorageKey(), safeProgress);
        localStorage.setItem(getSelectedStageStorageKey(), safeProgress.selectedStageId);
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
        localStorage.setItem(STORAGE_KEYS.isLoggedIn, "true");
        return user;
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEYS.user);
        localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
        window.location.href = "login.html";
    }

    function redirectIfLoggedIn() {
        if (isLoggedIn()) {
            window.location.href = "path.html";
            return true;
        }

        return false;
    }

    function requireLogin() {
        if (isLoggedIn()) {
            return true;
        }

        alert("Please log in before starting the course.");
        window.location.href = "login.html";
        return false;
    }

    function setupLogoutLinks() {
        const logoutLinks = document.querySelectorAll("[data-logout]");

        logoutLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                logout();
            });
        });
    }

    function setupDynamicNavigation() {
        const loggedIn = isLoggedIn();
        const loginLinks = document.querySelectorAll('a[href="login.html"]:not([data-logout])');
        const courseLinks = document.querySelectorAll('a[href="path.html"], a[href="exercise.html"], [data-logout]');

        function setLinkVisibility(link, visible) {
            const listItem = link.closest("li");
            const target = listItem || link;

            target.classList.toggle("is-hidden", !visible);
            link.setAttribute("aria-hidden", visible ? "false" : "true");
        }

        loginLinks.forEach(function (link) {
            setLinkVisibility(link, !loggedIn);
        });

        courseLinks.forEach(function (link) {
            setLinkVisibility(link, loggedIn);
        });
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

    function getQuestionAnswerState(questionId, progress) {
        const question = getQuestionById(questionId);

        if (!question) {
            return { status: "unanswered" };
        }

        const safeProgress = progress || getProgress();
        return safeProgress.stages[question.stageId].answeredQuestions[question.id] || { status: "unanswered" };
    }

    function getStageStats(stageId, progress) {
        const safeProgress = progress || getProgress();
        const stage = getStageById(stageId);
        const stageProgress = safeProgress.stages[stage.id];
        const questions = getQuestionsForStage(stage.id);
        const answeredStates = questions
            .map(function (question) {
                return stageProgress.answeredQuestions[question.id];
            })
            .filter(Boolean);
        const correctCount = answeredStates.filter(function (answerState) {
            return answerState.status === "correct";
        }).length;
        const incorrectCount = answeredStates.filter(function (answerState) {
            return answerState.status === "incorrect";
        }).length;

        return {
            stage: stage,
            total: questions.length,
            answered: answeredStates.length,
            correct: correctCount,
            incorrect: incorrectCount,
            hasQuestions: questions.length > 0,
            unlocked: Boolean(stageProgress.unlocked),
            completed: Boolean(stageProgress.completed)
        };
    }

    function getOverallStats(progress) {
        const safeProgress = progress || getProgress();
        const answeredStates = QUESTION_BANK
            .map(function (question) {
                return safeProgress.stages[question.stageId].answeredQuestions[question.id];
            })
            .filter(Boolean);
        const correctCount = answeredStates.filter(function (answerState) {
            return answerState.status === "correct";
        }).length;
        const incorrectCount = answeredStates.filter(function (answerState) {
            return answerState.status === "incorrect";
        }).length;

        return {
            total: QUESTION_BANK.length,
            answered: answeredStates.length,
            correct: correctCount,
            incorrect: incorrectCount,
            completedStages: COURSE_STAGES.filter(function (stage) {
                return getStageStats(stage.id, safeProgress).completed;
            }).length
        };
    }

    function getCompletionPercent(progress) {
        const stats = getOverallStats(progress);
        return stats.total === 0 ? 0 : Math.round((stats.answered / stats.total) * 100);
    }

    function getStageStatus(stageId, progress) {
        const stats = getStageStats(stageId, progress);

        if (!stats.hasQuestions || !stats.unlocked) {
            return "locked";
        }

        return stats.completed ? "completed" : "current";
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

        safeProgress.streak = safeProgress.lastActiveDate === getLocalDateString(yesterday)
            ? safeProgress.streak + 1
            : 1;
        safeProgress.lastActiveDate = today;

        return saveProgress(safeProgress);
    }

    function submitQuestionAnswer(questionId, selectedIndex) {
        const question = getQuestionById(questionId);

        if (!question) {
            return {
                accepted: false,
                awarded: false,
                progress: getProgress(),
                answerState: { status: "unanswered" }
            };
        }

        let safeProgress = registerDailyActivity(getProgress());
        const stageProgress = safeProgress.stages[question.stageId];
        const existingAnswer = stageProgress.answeredQuestions[question.id];

        // The first submitted answer is final for scoring.
        if (existingAnswer) {
            return {
                accepted: false,
                alreadyAnswered: true,
                awarded: false,
                progress: safeProgress,
                answerState: existingAnswer
            };
        }

        const correct = Number(selectedIndex) === question.correctAnswer;
        const alreadyEarnedXp = safeProgress.earnedQuestionIds.includes(question.id);
        const answerState = {
            status: correct ? "correct" : "incorrect",
            selectedIndex: Number(selectedIndex),
            firstAttemptCorrect: correct,
            xpAwarded: correct && !alreadyEarnedXp,
            answeredAt: new Date().toISOString()
        };

        stageProgress.answeredQuestions[question.id] = answerState;

        if (correct && !alreadyEarnedXp) {
            safeProgress.totalXP += question.xpReward;
            safeProgress.xp = safeProgress.totalXP;
            safeProgress.level = calculateLevel(safeProgress.totalXP);
            safeProgress.earnedQuestionIds.push(question.id);
        }

        safeProgress = saveProgress(safeProgress);

        return {
            accepted: true,
            alreadyAnswered: false,
            awarded: correct && !alreadyEarnedXp,
            xpAwarded: correct && !alreadyEarnedXp ? question.xpReward : 0,
            progress: safeProgress,
            answerState: answerState
        };
    }

    function restartStage(stageValue) {
        const safeProgress = getProgress();
        const stageId = normalizeStageId(stageValue || safeProgress.selectedStageId);

        if (!safeProgress.stages[stageId]) {
            return saveProgress(safeProgress);
        }

        safeProgress.stages[stageId].answeredQuestions = {};
        safeProgress.currentQuestionByStage[stageId] = 0;
        safeProgress.selectedStageId = stageId;
        safeProgress.selectedStage = getStageById(stageId).number;

        return saveProgress(safeProgress);
    }

    function setCurrentQuestionIndex(stageId, index) {
        const safeProgress = getProgress();
        const normalizedStageId = normalizeStageId(stageId || safeProgress.selectedStageId);
        const questions = getQuestionsForStage(normalizedStageId);

        safeProgress.currentQuestionByStage[normalizedStageId] = questions.length > 0
            ? clamp(Number(index) || 0, 0, questions.length - 1)
            : 0;

        return saveProgress(safeProgress);
    }

    function getCurrentQuestionIndex(stageId) {
        const safeProgress = getProgress();
        const normalizedStageId = normalizeStageId(stageId || safeProgress.selectedStageId);
        const questions = getQuestionsForStage(normalizedStageId);
        const index = Number(safeProgress.currentQuestionByStage[normalizedStageId]) || 0;

        return questions.length > 0 ? clamp(index, 0, questions.length - 1) : 0;
    }

    function setSelectedStage(stageValue) {
        const safeProgress = getProgress();
        const stageId = normalizeStageId(stageValue);
        const stats = getStageStats(stageId, safeProgress);

        if (!stats.hasQuestions || !stats.unlocked) {
            return saveProgress(safeProgress);
        }

        safeProgress.selectedStageId = stageId;
        safeProgress.selectedStage = getStageById(stageId).number;
        localStorage.setItem(STORAGE_KEYS.selectedStage, stageId);

        return saveProgress(safeProgress);
    }

    window.PyLearnApp = {
        STORAGE_KEYS,
        COURSE_STAGES,
        QUESTION_BANK,
        TOTAL_QUESTIONS,
        getLocalDateString,
        getUser,
        setUser,
        isLoggedIn,
        logout,
        requireLogin,
        redirectIfLoggedIn,
        setupLogoutLinks,
        setupDynamicNavigation,
        getDisplayName,
        getProgress,
        saveProgress,
        ensureProgress,
        calculateLevel,
        getQuestionById,
        getQuestionsForStage,
        getQuestionAnswerState,
        getStageById,
        getStageStats,
        getStageStatus,
        getOverallStats,
        getCompletionPercent,
        getFirstUnlockedPlayableStageId,
        registerDailyActivity,
        submitQuestionAnswer,
        restartStage,
        setCurrentQuestionIndex,
        getCurrentQuestionIndex,
        setSelectedStage
    };

    document.addEventListener("DOMContentLoaded", setupLogoutLinks);
    document.addEventListener("DOMContentLoaded", setupDynamicNavigation);
})();
