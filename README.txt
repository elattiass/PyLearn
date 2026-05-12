PyLearn - Group 21
==================

Project name:
PyLearn

Group:
Group 21

Project stage:
This project is Part B of the WEB Development Course project.

Overview:
PyLearn is a gamified Python learning platform for beginners and early-stage university students.
The client-side implementation was built using HTML, CSS, and JavaScript only.

Important implementation note:
The original Part A idea included free code writing and code completion exercises.
For Part B, the implementation decision was changed:
- No free code editor was built.
- The exercise system is based on multiple-choice Python questions.

Reason for the change:
The multiple-choice structure simplifies answer checking, data handling, and future database management while keeping the same educational and gamified learning goal.

Current simulation behavior:
There is no real backend in this stage.
Answer validation, XP calculation, daily streak updates, level progress, stage unlocking, answered question states, and per-user progress are simulated on the client side using JavaScript and localStorage.
Authentication is also simulated using localStorage with a mock login flag, and logged-in users are redirected away from the login page.
Real authentication and real access control will be implemented on the server side in a future project stage.

Project pages:
1. index.html
   Home page that introduces PyLearn, its goals, and its benefits.

2. login.html
   Login page with a validated form for email and password.

3. path.html
   Learning path page that displays XP, level, streak, progress bar, and gamified learning stages.

4. exercise.html
   Exercise page with multiple-choice Python questions, instant feedback, stage navigation, and XP updates.

Main functionality:
- Shared navigation across all pages
- Dynamic navigation that changes links based on login state
- Responsive design for desktop and mobile
- Login form validation
- Mock login saved in localStorage with separate progress per email address
- Guest access restriction for the learning path and exercise pages
- Logout link that clears the mock login data
- Progress tracking with XP, level, streak, selected stage, and answered question states
- Gamified learning path with visual stage states: Locked, Current, Completed
- Multiple-choice exercise experience with immediate feedback
- Question navigation using Previous, Next, and clickable question tracker buttons
- Saved answers shown when users revisit answered questions
- First-submission-only scoring, so changing an answer later does not award XP
- Restart Stage practice button that clears visible stage answers without duplicating already earned XP

Question and scoring behavior:
- Questions are organized by learning stages when the current question bank supports it.
- The current project uses 30 built-in multiple-choice questions from python_quiz_questions.json.
- Stage completion counts answered questions, not only correct answers.
- The next playable stage unlocks only after all available questions in the current playable stage are answered.
- Easy questions award 5 XP.
- Medium questions award 10 XP.
- Hard questions award 15 XP.
- XP is awarded only if the first submitted answer is correct.
- Already answered questions cannot award XP again after refresh or navigation.
- Restarting a stage clears the current visible attempt for practice, but previously earned question XP remains protected.
- Incorrect answers highlight the selected wrong option in red and the correct option in green.

Validation features:
- Login email cannot be empty
- Login email must be in a valid format
- Login password cannot be empty
- Login password must be at least 6 characters long
- Exercise form requires the user to select an answer before submitting

Animations and design:
- Hover effects on buttons and cards
- Animated feedback and section entrance effects
- Floating dashboard hero animation
- Rounded cards, progress bars, badges, and colorful gamified stage styling
- Responsive layout for mobile and desktop

Folder structure:
PyLearn_Group21/
|
|-- index.html
|-- login.html
|-- path.html
|-- exercise.html
|-- python_quiz_questions.json
|
|-- css/
|   |-- style.css
|
|-- js/
|   |-- app.js
|   |-- login.js
|   |-- path.js
|   |-- exercise.js
|
|-- images/
|   |-- README_images.txt
|
|-- README.txt

How to run:
Open index.html in a browser.
No build tools, backend server, TypeScript, React, or external frameworks are required.
