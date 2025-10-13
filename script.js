const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreDisplay = document.getElementById('final-score');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const gameArea = document.getElementById('game-area');
const endHighScoreDisplay = document.getElementById('end-high-score');

let score = 0;
let highScore = 0;
let level = 1;
let gameSpeed = 2000;
let gameInterval;

// Function to update high score display
function updateHighScoreDisplay() {
    endHighScoreDisplay.textContent = highScore;
}

const scoreThresholds = [
    { score: 30, message: "Amazing!" },
    { score: 50, message: "Fast Reactor!" },
    { score: 70, message: "Keep it up!" },
    { score: 100, message: "Budget Master!" }
];
let triggeredThresholds = {};

const expenses = [
    // Needs
    { name: "Rent", category: "Needs" },
    { name: "Mortgage Payment", category: "Needs" },
    { name: "Electricity Bill", category: "Needs" },
    { name: "Water Bill", category: "Needs" },
    { name: "Gas Bill", category: "Needs" },
    { name: "Groceries", category: "Needs" },
    { name: "Public Transport", category: "Needs" },
    { name: "Car Fuel", category: "Needs" },
    { name: "Car Insurance", category: "Needs" },
    { name: "Health Insurance", category: "Needs" },
    { name: "Prescription Medicine", category: "Needs" },
    { name: "School Fees", category: "Needs" },
    { name: "Childcare", category: "Needs" },
    { name: "Internet Bill", category: "Needs" },
    { name: "Phone Bill", category: "Needs" },
    { name: "Student Loan Repayment", category: "Needs" },
    { name: "Home Maintenance", category: "Needs" },
    { name: "Essential Clothing", category: "Needs" },
    { name: "Toiletries", category: "Needs" },
    { name: "Pet Food", category: "Needs" },
    { name: "Bus Fare", category: "Needs" },
    { name: "Train Ticket", category: "Needs" },
    { name: "Doctor's Visit", category: "Needs" },
    { name: "Dental Check-up", category: "Needs" },
    { name: "Basic Haircut", category: "Needs" },
    { name: "Work Supplies", category: "Needs" },
    { name: "Taxes", category: "Needs" },
    { name: "Emergency Fund Contribution", category: "Needs" },

    // Wants
    { name: "Pizza", category: "Wants" },
    { name: "Movie Ticket", category: "Wants" },
    { name: "Fashion T-shirt", category: "Wants" },
    { name: "New Smartphone", category: "Wants" },
    { name: "Concert Tickets", category: "Wants" },
    { name: "Dining Out", category: "Wants" },
    { name: "Vacation Travel", category: "Wants" },
    { name: "Designer Clothes", category: "Wants" },
    { name: "Video Games", category: "Wants" },
    { name: "Streaming Service (Netflix)", category: "Wants" },
    { name: "Music Subscription (Spotify)", category: "Wants" },
    { name: "Gym Membership (Leisure)", category: "Wants" },
    { name: "Coffee Shop Visit", category: "Wants" },
    { name: "Leisure Books", category: "Wants" },
    { name: "Hobby Supplies", category: "Wants" },
    { name: "New Gadget", category: "Wants" },
    { name: "Spa Day", category: "Wants" },
    { name: "Car Upgrade", category: "Wants" },
    { name: "Jewelry", category: "Wants" },
    { name: "Alcohol", category: "Wants" },
    { name: "Tobacco", category: "Wants" },
    { name: "Lottery Tickets", category: "Wants" },
    { name: "Impulse Purchase", category: "Wants" },
    { name: "Luxury Goods", category: "Wants" },
    { name: "Takeaway Food", category: "Wants" },
    { name: "Fashion Shoes", category: "Wants" },
    { name: "Magazine Subscription", category: "Wants" },
    { name: "Hair Dye", category: "Wants" },
    { name: "Manicure/Pedicure", category: "Wants" },
    { name: "Laptop Upgrade", category: "Wants" },
    { name: "Home Decor", category: "Wants" },
    { name: "Gifts (Non-essential)", category: "Wants" },

    // Savings
    { name: "Savings Bond", category: "Savings" },
    { name: "Stock Investment", category: "Savings" },
    { name: "Mutual Fund", category: "Savings" },
    { name: "SIP (Systematic Investment Plan)", category: "Savings" },
    { name: "Retirement Fund", category: "Savings" },
    { name: "College Fund", category: "Savings" },
    { name: "Emergency Savings", category: "Savings" },
    { name: "Fixed Deposit", category: "Savings" },
    { name: "Real Estate Investment", category: "Savings" },
    { name: "Gold Investment", category: "Savings" },
    { name: "Cryptocurrency Investment", category: "Savings" },
    { name: "High-Yield Savings Account", category: "Savings" },
    { name: "Brokerage Account Contribution", category: "Savings" },
];

const slowTimePowerUp = document.getElementById('slow-time-power-up');
const autoSortPowerUp = document.getElementById('auto-sort-power-up');
const doublePointsPowerUp = document.getElementById('double-points-power-up');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
slowTimePowerUp.addEventListener('click', activateSlowTime);
autoSortPowerUp.addEventListener('click', activateAutoSort);
doublePointsPowerUp.addEventListener('click', activateDoublePoints);

let doublePointsActive = false;

const midGamePopup = document.getElementById('mid-game-popup');
const popupMessage = document.getElementById('popup-message');

function activateDoublePoints() {
    doublePointsPowerUp.disabled = true;
    doublePointsActive = true;

    setTimeout(() => {
        doublePointsActive = false;
        doublePointsPowerUp.disabled = false;
    }, 5000); // 5 seconds duration
}

function activateAutoSort() {
    autoSortPowerUp.disabled = true;
    const existingExpenses = gameArea.querySelectorAll('.expense');
    existingExpenses.forEach(expense => {
        const category = expense.dataset.category;
        let bucketId = '';
        if (category === 'Needs') {
            bucketId = 'needs-bucket';
        } else if (category === 'Wants') {
            bucketId = 'wants-bucket';
        } else if (category === 'Savings') {
            bucketId = 'savings-bucket';
        }
        const bucket = document.getElementById(bucketId);
        handleDrop(expense, bucket);
    });

    setTimeout(() => {
        autoSortPowerUp.disabled = false;
    }, 10000); // 10 seconds duration
}

function activateSlowTime() {
    slowTimePowerUp.disabled = true;
    const originalGameSpeed = gameSpeed;
    gameSpeed *= 2; // Slow down the game

    setTimeout(() => {
        gameSpeed = originalGameSpeed;
        slowTimePowerUp.disabled = false;
    }, 5000); // 5 seconds duration
}

function displayMidGamePopup(message) {
    popupMessage.textContent = message;
    midGamePopup.style.display = 'block';
    midGamePopup.classList.add('popup-active');

    setTimeout(() => {
        midGamePopup.classList.remove('popup-active');
        midGamePopup.classList.add('popup-exiting');
        setTimeout(() => {
            midGamePopup.classList.remove('popup-exiting');
            midGamePopup.style.display = 'none';
        }, 800); // Match popup-rope-exit animation duration
    }, 1500); // Display for 1.5 seconds (before exit starts)
}

function startGame() {
    score = 0;
    level = 1;
    gameSpeed = 2000;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    triggeredThresholds = {}; // Reset for new game

    // Load high score from local storage
    highScore = localStorage.getItem("highScore") || 0;
    updateHighScoreDisplay();

    startScreen.style.display = 'none';
    endScreen.style.display = 'none';
    gameContainer.style.display = 'block';

    const existingExpenses = gameArea.querySelectorAll('.expense');
    existingExpenses.forEach(expense => {
        clearInterval(expense.dataset.intervalId);
        if (gameArea.contains(expense)) {
            gameArea.removeChild(expense);
        }
    });

    gameInterval = setTimeout(gameLoop, gameSpeed);
}

function gameLoop() {
    createExpense();
    if (gameSpeed > 500) {
        gameSpeed -= 25;
    }
    const newLevel = Math.floor((2000 - gameSpeed) / 150) + 1;
    if (newLevel !== level) {
        level = newLevel;
        levelDisplay.textContent = level;
        levelDisplay.classList.add('pulse-animation');
        setTimeout(() => {
            levelDisplay.classList.remove('pulse-animation');
        }, 400);
    }
    gameInterval = setTimeout(gameLoop, gameSpeed);
}

function createExpense() {
    const randomIndex = Math.floor(Math.random() * expenses.length);
    const expenseData = expenses[randomIndex];

    const expenseElement = document.createElement('div');
    expenseElement.classList.add('expense');
    expenseElement.textContent = expenseData.name;
    expenseElement.dataset.category = expenseData.category;

    const randomX = Math.random() * (gameArea.offsetWidth - 100);
    expenseElement.style.left = `${randomX}px`;
    expenseElement.style.top = '-50px';

    gameArea.appendChild(expenseElement);

    let topPosition = -50;
    const fallInterval = setInterval(() => {
        if (topPosition >= gameArea.offsetHeight) {
            clearInterval(fallInterval);
            if(gameArea.contains(expenseElement)) {
                gameArea.removeChild(expenseElement);
                endGame();
            }
        } else {
            topPosition += 5;
            expenseElement.style.top = `${topPosition}px`;
        }
    }, 50);

    expenseElement.dataset.intervalId = fallInterval;
    makeDraggable(expenseElement, fallInterval);
}

function makeDraggable(element, fallInterval) {
    let offsetX, offsetY, clientX, clientY, isDragging = false, animationFrame;

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: false });

    function dragStart(e) {
        e.preventDefault();
        clearInterval(fallInterval);
        element.classList.add('dragging');
        isDragging = true;

        clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        const rect = element.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;

        animationFrame = requestAnimationFrame(animation);

        if (e.type === 'mousedown') {
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
        } else {
            document.addEventListener('touchmove', dragMove);
            document.addEventListener('touchend', dragEnd);
        }
    }

    function dragMove(e) {
        if (isDragging) {
            clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        }
    }
    
    function animation() {
        if (isDragging) {
            element.style.left = `${clientX - gameArea.getBoundingClientRect().left - offsetX}px`;
            element.style.top = `${clientY - gameArea.getBoundingClientRect().top - offsetY}px`;
            animationFrame = requestAnimationFrame(animation);
        }
    }

    function dragEnd(e) {
        isDragging = false;
        cancelAnimationFrame(animationFrame);
        
        if (e.type === 'mouseup') {
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
        } else {
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('touchend', dragEnd);
        }

        element.classList.remove('dragging');

        const droppedBucket = getDroppedBucket(element);
        if (droppedBucket) {
            handleDrop(element, droppedBucket);
        } else {
            endGame();
        }
        // Apply bounce animation before removing
        element.classList.add('bounce-on-hit');
        setTimeout(() => {
            if (gameArea.contains(element)) {
                gameArea.removeChild(element);
            }
        }, 300); // Match bounce animation duration
    }
}

function getDroppedBucket(element) {
    const elementRect = element.getBoundingClientRect();
    const buckets = document.querySelectorAll('.bucket');
    for (const bucket of buckets) {
        const bucketRect = bucket.getBoundingClientRect();
        if (
            elementRect.left < bucketRect.right &&
            elementRect.right > bucketRect.left &&
            elementRect.top < bucketRect.bottom &&
            elementRect.bottom > bucketRect.top
        ) {
            return bucket;
        }
    }
    return null;
}

function handleDrop(element, droppedBucket) {
    const bucketId = droppedBucket.id;
    const expenseCategory = element.dataset.category;

    let correctBucketId = '';
    if (expenseCategory === 'Needs') {
        correctBucketId = 'needs-bucket';
    } else if (expenseCategory === 'Wants') {
        correctBucketId = 'wants-bucket';
    } else if (expenseCategory === 'Savings') {
        correctBucketId = 'savings-bucket';
    }

    if (bucketId === correctBucketId) {
        // Correct drop
        updateScore(10);
    } else {
        // Incorrect drop
        endGame();
    }
}

function updateScore(change) {
    if (doublePointsActive) {
        change *= 2;
    }
    score += change;
    scoreDisplay.textContent = score;
    scoreDisplay.classList.add('pulse-animation');
    setTimeout(() => {
        scoreDisplay.classList.remove('pulse-animation');
    }, 400);

    // Check for score thresholds
    scoreThresholds.forEach(threshold => {
        if (score >= threshold.score && !triggeredThresholds[threshold.score]) {
            displayMidGamePopup(threshold.message);
            triggeredThresholds[threshold.score] = true;
        }
    });
}

function endGame() {
    clearTimeout(gameInterval);

    const existingExpenses = gameArea.querySelectorAll('.expense');
    existingExpenses.forEach(expense => {
        clearInterval(expense.dataset.intervalId);
        if (gameArea.contains(expense)) {
            gameArea.removeChild(expense);
        }
    });

    // Check for new high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        updateHighScoreDisplay();
    }

    finalScoreDisplay.textContent = score;
    gameContainer.style.display = 'none';
    endScreen.style.display = 'block';
}