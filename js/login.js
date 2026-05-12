document.addEventListener("DOMContentLoaded", function () {
    if (PyLearnApp.redirectIfLoggedIn()) {
        return;
    }

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");

    function showMessage(text, type) {
        loginMessage.textContent = text;
        loginMessage.className = `message ${type} show`;
    }

    function isValidEmail(email) {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const errors = [];

        if (!email) {
            errors.push("Email is required.");
        } else if (!/^[\x00-\x7F]+$/.test(email)) {
            errors.push("Email must use English letters, numbers, and standard symbols only.");
        } else if (!isValidEmail(email)) {
            errors.push("Please enter a valid email address.");
        }

        if (!password) {
            errors.push("Password is required.");
        } else if (password.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }

        if (errors.length > 0) {
            showMessage(errors.join(" "), "error");
            return;
        }

        const mockUser = {
            email: email,
            name: PyLearnApp.getDisplayName({ email: email }),
            loginTime: new Date().toISOString()
        };

        PyLearnApp.setUser(mockUser);

        let progress = PyLearnApp.ensureProgress();
        progress = PyLearnApp.registerDailyActivity(progress);

        showMessage(
            `Welcome, ${mockUser.name}! Your progress was loaded successfully. Redirecting to the learning path...`,
            "success"
        );

        loginForm.reset();

        window.setTimeout(function () {
            window.location.href = "path.html";
        }, 900);
    });
});
