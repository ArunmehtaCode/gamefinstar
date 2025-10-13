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
    { name: "Rent", category: "Needs", explanation: "Housing is a basic need." },
    { name: "Mortgage Payment", category: "Needs", explanation: "Housing is a basic need." },
    { name: "Electricity Bill", category: "Needs", explanation: "Utilities are essential for daily living." },
    { name: "Water Bill", category: "Needs", explanation: "Utilities are essential for daily living." },
    { name: "Gas Bill", category: "Needs", explanation: "Utilities are essential for daily living." },
    { name: "Groceries", category: "Needs", explanation: "Food is a basic necessity." },
    { name: "Public Transport", category: "Needs", explanation: "Transportation for work or essential travel is a need." },
    { name: "Car Fuel", category: "Needs", explanation: "Fuel for essential travel is a need." },
    { name: "Car Insurance", category: "Needs", explanation: "Car insurance is a legal requirement in most places." },
    { name: "Health Insurance", category: "Needs", explanation: "Health insurance is crucial for managing healthcare costs." },
    { name: "Prescription Medicine", category: "Needs", explanation: "Essential medicine is a health need." },
    { name: "School Fees", category: "Needs", explanation: "Education is a need for personal development." },
    { name: "Childcare", category: "Needs", explanation: "Childcare is a need for working parents." },
    { name: "Internet Bill", category: "Needs", explanation: "Internet access is often a need for work or school." },
    { name: "Phone Bill", category: "Needs", explanation: "A phone is often a need for communication and safety." },
    { name: "Student Loan Repayment", category: "Needs", explanation: "Repaying debt is a financial responsibility." },
    { name: "Home Maintenance", category: "Needs", explanation: "Essential home repairs are a need." },
    { name: "Essential Clothing", category: "Needs", explanation: "Basic clothing is a necessity." },
    { name: "Toiletries", category: "Needs", explanation: "Personal hygiene products are a need." },
    { name: "Pet Food", category: "Needs", explanation: "Food for pets is a need for their well-being." },
    { name: "Bus Fare", category: "Needs", explanation: "Transportation for work or essential travel is a need." },
    { name: "Train Ticket", category: "Needs", explanation: "Transportation for work or essential travel is a need." },
    { name: "Doctor's Visit", category: "Needs", explanation: "Healthcare is a fundamental need." },
    { name: "Dental Check-up", category: "Needs", explanation: "Dental care is important for overall health." },
    { name: "Basic Haircut", category: "Needs", explanation: "Basic grooming is a need." },
    { name: "Work Supplies", category: "Needs", explanation: "Supplies required for your job are a need." },
    { name: "Taxes", category: "Needs", explanation: "Paying taxes is a legal obligation." },
    { name: "Emergency Fund Contribution", category: "Needs", explanation: "Building an emergency fund is a critical financial need." },

    // Wants
    { name: "Pizza", category: "Wants", explanation: "Dining out or ordering takeout is a want, not a need." },
    { name: "Movie Ticket", category: "Wants", explanation: "Entertainment is a want." },
    { name: "Fashion T-shirt", category: "Wants", explanation: "Fashion clothing is a want, not a basic need." },
    { name: "New Smartphone", category: "Wants", explanation: "Upgrading your phone is usually a want." },
    { name: "Concert Tickets", category: "Wants", explanation: "Entertainment is a want." },
    { name: "Dining Out", category: "Wants", explanation: "Eating at restaurants is a want." },
    { name: "Vacation Travel", category: "Wants", explanation: "Leisure travel is a want." },
    { name: "Designer Clothes", category: "Wants", explanation: "Luxury items are wants." },
    { name: "Video Games", category: "Wants", explanation: "Entertainment is a want." },
    { name: "Streaming Service (Netflix)", category: "Wants", explanation: "Subscription services for entertainment are wants." },
    { name: "Music Subscription (Spotify)", category: "Wants", explanation: "Subscription services for entertainment are wants." },
    { name: "Gym Membership (Leisure)", category: "Wants", explanation: "A gym membership for leisure is a want." },
    { name: "Coffee Shop Visit", category: "Wants", explanation: "Buying coffee is a want." },
    { name: "Leisure Books", category: "Wants", explanation: "Books for entertainment are a want." },
    { name: "Hobby Supplies", category: "Wants", explanation: "Supplies for hobbies are wants." },
    { name: "New Gadget", category: "Wants", explanation: "New gadgets are typically wants." },
    { name: "Spa Day", category: "Wants", explanation: "Luxury experiences are wants." },
    { name: "Car Upgrade", category: "Wants", explanation: "Upgrading your car is a want." },
    { name: "Jewelry", category: "Wants", explanation: "Jewelry is a luxury item and a want." },
    { name: "Alcohol", category: "Wants", explanation: "Alcohol is a want." },
    { name: "Tobacco", category: "Wants", explanation: "Tobacco is a want." },
    { name: "Lottery Tickets", category: "Wants", explanation: "Gambling is a want." },
    { name: "Impulse Purchase", category: "Wants", explanation: "Impulse buys are wants." },
    { name: "Luxury Goods", category: "Wants", explanation: "Luxury items are wants." },
    { name: "Takeaway Food", category: "Wants", explanation: "Ordering takeaway is a want." },
    { name: "Fashion Shoes", category: "Wants", explanation: "Fashion shoes are a want." },
    { name: "Magazine Subscription", category: "Wants", explanation: "Magazine subscriptions are wants." },
    { name: "Hair Dye", category: "Wants", explanation: "Cosmetic treatments are wants." },
    { name: "Manicure/Pedicure", category: "Wants", explanation: "Cosmetic treatments are wants." },
    { name: "Laptop Upgrade", category: "Wants", explanation: "Upgrading your laptop is usually a want." },
    { name: "Home Decor", category: "Wants", explanation: "Decorative items for your home are wants." },
    { name: "Gifts (Non-essential)", category: "Wants", explanation: "Non-essential gifts are wants." },

    // Savings
    { name: "Savings Bond", category: "Savings", explanation: "Savings bonds are a form of investment." },
    { name: "Stock Investment", category: "Savings", explanation: "Investing in stocks is a way to grow your money." },
    { name: "Mutual Fund", category: "Savings", explanation: "Mutual funds are a type of investment." },
    { name: "SIP (Systematic Investment Plan)", category: "Savings", explanation: "A SIP is a disciplined investment strategy." },
    { name: "Retirement Fund", category: "Savings", explanation: "Saving for retirement is a long-term financial goal." },
    { name: "College Fund", category: "Savings", explanation: "Saving for education is a long-term financial goal." },
    { name: "Emergency Savings", category: "Savings", explanation: "Building an emergency fund is a crucial part of financial planning." },
    { name: "Fixed Deposit", category: "Savings", explanation: "A fixed deposit is a safe investment option." },
    { name: "Real Estate Investment", category: "Savings", explanation: "Investing in real estate is a long-term investment." },
    { name: "Gold Investment", category: "Savings", explanation: "Gold is often considered a safe-haven asset." },
    { name: "Cryptocurrency Investment", category: "Savings", explanation: "Cryptocurrencies are a high-risk, high-reward investment." },
    { name: "High-Yield Savings Account", category: "Savings", explanation: "A high-yield savings account helps your money grow faster." },
    { name: "Brokerage Account Contribution", category: "Savings", explanation: "Contributing to a brokerage account is a form of investment." },
];

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

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
                endGame("You missed an expense!");
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
            endGame("You dropped an expense outside the buckets!");
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

const explanationDisplay = document.getElementById('explanation');

function handleDrop(element, droppedBucket) {
    const bucketId = droppedBucket.id;
    const expenseCategory = element.dataset.category;
    const expenseName = element.textContent;

    const expense = expenses.find(e => e.name === expenseName);

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
        endGame(expense.explanation);
    }
}

function updateScore(change) {
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

function endGame(explanation) {
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
    explanationDisplay.textContent = explanation;
    gameContainer.style.display = 'none';
    endScreen.style.display = 'block';
}