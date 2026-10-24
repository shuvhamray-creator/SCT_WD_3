
const questions = [
    {
        category: "WEB DEVELOPMENT",
        question: "Which language is used to add interactivity to a web page?",
        options: ["HTML", "CSS", "JavaScript", "SQL"],
        answer: 2,
        explanation:
            "JavaScript makes web pages interactive with actions and dynamic updates."
    },
    {
        category: "GENERAL KNOWLEDGE",
        question: "Which is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Saturn", "Neptune"],
        answer: 1,
        explanation:
            "Jupiter is the largest planet in our solar system."
    },
    {
        category: "COMPUTER SCIENCE",
        question: "What does CPU stand for?",
        options: [
            "Central Process Utility",
            "Computer Personal Unit",
            "Central Processing Unit",
            "Core Program User"
        ],
        answer: 2,
        explanation:
            "CPU stands for Central Processing Unit. It executes instructions."
    },
    {
        category: "SCIENCE",
        question: "What is the chemical formula for water?",
        options: ["CO₂", "O₂", "NaCl", "H₂O"],
        answer: 3,
        explanation:
            "A water molecule contains two hydrogen atoms and one oxygen atom."
    },
    {
        category: "WEB DEVELOPMENT",
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        answer: 1,
        explanation:
            "The <a> (anchor) tag creates a hyperlink in HTML."
    }
];

// Get HTML elements
const welcomeScreen = document.querySelector("#welcome-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");

const startBtn = document.querySelector("#start-btn");
const nextBtn = document.querySelector("#next-btn");
const restartBtn = document.querySelector("#restart-btn");

const currentNumber = document.querySelector("#current-number");
const totalNumber = document.querySelector("#total-number");
const progressBar = document.querySelector("#progress-bar");
const categoryLabel = document.querySelector("#category-label");
const timerNumber = document.querySelector("#timer-number");
const questionText = document.querySelector("#question-text");
const answersContainer = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const answeredLabel = document.querySelector("#answered-label");

let questionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerId = null;
let hasAnswered = false;

totalNumber.textContent = String(questions.length).padStart(2, "0");

// Display one screen at a time
function showScreen(screenToShow) {
    [welcomeScreen, quizScreen, resultScreen].forEach(screen => {
        screen.classList.add("hidden");
    });

    screenToShow.classList.remove("hidden");
}

// Start or restart the quiz
function startQuiz() {
    clearInterval(timerId);

    questionIndex = 0;
    score = 0;

    showScreen(quizScreen);
    renderQuestion();
}

// Display the current question and options
function renderQuestion() {
    clearInterval(timerId);

    hasAnswered = false;
    timeLeft = 15;

    const question = questions[questionIndex];

    currentNumber.textContent = String(questionIndex + 1).padStart(2, "0");
    categoryLabel.textContent = question.category;
    timerNumber.textContent = timeLeft;
    questionText.textContent = question.question;

    document.querySelector(".timer").classList.remove("warning");

    progressBar.style.width =
        `${(questionIndex / questions.length) * 100}%`;

    answersContainer.innerHTML = "";
    feedback.textContent = "";
    feedback.className = "feedback";

    answeredLabel.textContent = "CHOOSE YOUR ANSWER";
    nextBtn.disabled = true;

    nextBtn.innerHTML =
        questionIndex === questions.length - 1
            ? "See Results →"
            : "Next Question →";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "answer-option";
        button.type = "button";

        const letter = document.createElement("span");
        letter.className = "option-letter";
        letter.textContent = String.fromCharCode(65 + index);

        const optionText = document.createElement("span");
        optionText.textContent = option;

        button.append(letter, optionText);

        button.addEventListener("click", () => {
            chooseAnswer(index);
        });

        answersContainer.appendChild(button);
    });

    // Countdown timer
    timerId = setInterval(() => {
        timeLeft--;
        timerNumber.textContent = timeLeft;

        if (timeLeft <= 5) {
            document.querySelector(".timer").classList.add("warning");
        }

        if (timeLeft <= 0) {
            clearInterval(timerId);

            if (!hasAnswered) {
                chooseAnswer(-1);
            }
        }
    }, 1000);
}

// Check the selected answer
function chooseAnswer(selectedIndex) {
    if (hasAnswered) return;

    hasAnswered = true;
    clearInterval(timerId);

    const question = questions[questionIndex];
    const buttons = [
        ...answersContainer.querySelectorAll("button")
    ];

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        }

        if (
            index === selectedIndex &&
            selectedIndex !== question.answer
        ) {
            button.classList.add("incorrect");
        }
    });

    if (selectedIndex === question.answer) {
        score++;

        feedback.textContent =
            `Correct! ${question.explanation}`;

        feedback.classList.add("good");
        answeredLabel.textContent = "NICE WORK!";
    } else if (selectedIndex === -1) {
        feedback.textContent =
            `Time's up! ${question.explanation}`;

        feedback.classList.add("bad");
        answeredLabel.textContent = "TIME'S UP!";
    } else {
        feedback.textContent =
            `Not quite. ${question.explanation}`;

        feedback.classList.add("bad");
        answeredLabel.textContent = "KEEP GOING!";
    }

    progressBar.style.width =
        `${((questionIndex + 1) / questions.length) * 100}%`;

    nextBtn.disabled = false;
}

// Move to the next question
function nextQuestion() {
    if (!hasAnswered) return;

    if (questionIndex < questions.length - 1) {
        questionIndex++;
        renderQuestion();
    } else {
        showResults();
    }
}

// Calculate and display the final score
function showResults() {
    clearInterval(timerId);
    showScreen(resultScreen);

    const percentage = Math.round(
        (score / questions.length) * 100
    );

    document.querySelector("#score-percent").textContent =
        `${percentage}%`;

    document.querySelector("#correct-score").textContent =
        `${score} / ${questions.length}`;

    document.querySelector("#points-score").textContent =
        `${score * 20} pts`;

    document.querySelector("#score-ring").style.setProperty(
        "--score-angle",
        `${percentage * 3.6}deg`
    );

    let title = "Good effort!";
    let message =
        "Every attempt helps you learn. Give it another go and beat your score.";
    let icon = "↗";

    if (percentage === 100) {
        title = "Perfect score!";
        message =
            "Outstanding! You got every question right. Your brain is on fire.";
        icon = "✦";
    } else if (percentage >= 60) {
        title = "Nicely done!";
        message =
            "Great work! You have a solid handle on these topics. Keep it up.";
        icon = "✧";
    }

    document.querySelector("#result-title").textContent = title;
    document.querySelector("#result-message").textContent = message;
    document.querySelector(".result-icon").textContent = icon;
}

// Button events
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);
