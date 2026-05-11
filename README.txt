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
Answer validation, XP calculation, daily streak updates, level progress, and learning progress are currently simulated on the client side using JavaScript and localStorage.

Project pages:
1. index.html
   Home page that introduces PyLearn, its goals, and its benefits.

2. login.html
   Login page with a validated form for email and password.

3. path.html
   Learning path page that displays XP, level, streak, progress bar, and learning stages.

4. exercise.html
   Exercise page with multiple-choice Python questions, instant feedback, and XP updates.

Main functionality:
- Shared navigation across all pages
- Responsive design for desktop and mobile
- Login form validation
- Mock login saved in localStorage
- Progress tracking with XP, level, streak, and completed questions
- Gamified learning path with visual stage states
- Multiple-choice exercise experience with immediate feedback
- Next question flow and protection against repeated XP gain for the same question

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
- Rounded cards, progress bars, and colorful gamified stage styling

Folder structure:
PyLearn_Group21/
│
├── index.html
├── login.html
├── path.html
├── exercise.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── login.js
│   ├── path.js
│   └── exercise.js
│
├── images/
│   └── README_images.txt
│
└── README.txt

How to run:
Open index.html in a browser.
No build tools, backend server, TypeScript, React, or external frameworks are required.
