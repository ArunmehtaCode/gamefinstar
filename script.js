const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreDisplay = document.getElementById('final-score');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const needsBucket = document.getElementById('needs-bucket');
const wantsBucket = document.getElementById('wants-bucket');
const savingsBucket = document.getElementById('savings-bucket');
const messageContainer = document.getElementById('message-container');
const gameArea = document.getElementById('game-area');
const panda = document.querySelector('.panda');
const slowTimeButton = document.getElementById('slow-time-power-up');
const autoSortButton = document.getElementById('auto-sort-power-up');
const doublePointsButton = document.getElementById('double-points-power-up');
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');
const powerUpSound = document.getElementById('power-up-sound');
const gameOverSound = document.getElementById('game-over-sound');

let score = 0;
let level = 1;
let gameSpeed = 2000;
let gameInterval;
let combo = 0;
let isSlowTimeActive = false;
let isDoublePointsActive = false;
let slowTimeTimeout;
let doublePointsTimeout;

const expenses = [
    { name: 'Pizza', category: 'Wants' },
    { name: 'Bus Fare', category: 'Needs' },
    { name: 'Movie Ticket', category: 'Wants' },
    { name: 'T-shirt', category: 'Wants' },
    { name: 'Groceries', category: 'Needs' },
    { name: 'Rent', category: 'Needs' },
    { name: 'Savings Bond', category: 'Savings' },
    { name: 'Stock Investment', category: 'Savings' },
];

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
slowTimeButton.addEventListener('click', activateSlowTime);
autoSortButton.addEventListener('click', activateAutoSort);
doublePointsButton.addEventListener('click', activateDoublePoints);

function startGame() {
    score = 0;
    level = 1;
    combo = 0;
    gameSpeed = 2000;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;

    slowTimeButton.disabled = true;
    autoSortButton.disabled = true;
    doublePointsButton.disabled = true;

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

    const existingFireworks = endScreen.querySelectorAll('.firework');
    existingFireworks.forEach(firework => {
        endScreen.removeChild(firework);
    });

    gameInterval = setTimeout(gameLoop, gameSpeed);
}

function gameLoop() {
    createExpense();
    if (!isSlowTimeActive && gameSpeed > 500) {
        gameSpeed -= 25;
    }
    level = Math.floor((2000 - gameSpeed) / 150) + 1;
    levelDisplay.textContent = level;
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
    let offsetX, offsetY;

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart);

    function dragStart(e) {
        clearInterval(fallInterval);
        element.classList.add('dragging');

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        offsetX = clientX - element.getBoundingClientRect().left;
        offsetY = clientY - element.getBoundingClientRect().top;

        if (e.type === 'mousedown') {
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
        } else {
            document.addEventListener('touchmove', dragMove);
            document.addEventListener('touchend', dragEnd);
        }
    }

    function dragMove(e) {
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        element.style.left = `${clientX - gameArea.getBoundingClientRect().left - offsetX}px`;
        element.style.top = `${clientY - gameArea.getBoundingClientRect().top - offsetY}px`;
    }

    function dragEnd(e) {
        if (e.type === 'mouseup') {
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
        } else {
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('touchend', dragEnd);
        }

        element.classList.remove('dragging');

        const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;

        const droppedBucket = getDroppedBucket(clientX, clientY);
        if (droppedBucket) {
            handleDrop(element, droppedBucket.id.split('-')[0]);
        } else {
            endGame();
        }
        if (gameArea.contains(element)) {
            gameArea.removeChild(element);
        }
    }
}

function getDroppedBucket(x, y) {
    const buckets = document.querySelectorAll('.bucket');
    for (const bucket of buckets) {
        const rect = bucket.getBoundingClientRect();
        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
            return bucket;
        }
    }
    return null;
}

function handleDrop(element, bucketCategory) {
    const correctCategory = element.dataset.category.toLowerCase();
    const droppedBucket = document.getElementById(`${bucketCategory}-bucket`);

    if (bucketCategory === correctCategory) {
        combo++;
        let bonus = 1;
        if (combo >= 5) bonus = 2;
        if (combo >= 10) bonus = 3;
        let points = 5 * bonus;
        if (isDoublePointsActive) {
            points *= 2;
        }
        updateScore(points);
        pandaCheer();
        playSound(correctSound);

        droppedBucket.classList.add('bounce');
        setTimeout(() => {
            droppedBucket.classList.remove('bounce');
        }, 1000);

    } else {
        combo = 0;
        pandaSad();
        playSound(incorrectSound);
        endGame();
    }
}

function updateScore(change) {
    score += change;
    scoreDisplay.textContent = score;

    if (score >= 20) {
        slowTimeButton.disabled = false;
    }
    if (score >= 40) {
        autoSortButton.disabled = false;
    }
    if (score >= 60) {
        doublePointsButton.disabled = false;
    }

    if ([30, 50, 70, 100].includes(score)) {
        let message = '';
        if (score === 30) message = 'Amazing!';
        if (score === 50) message = 'Fast Reactor!';
        if (score === 70) message = 'Keep it up!';
        if (score === 100) message = 'Budget Master!';
        showMessage(message);
    }
}

function showMessage(message) {
    messageContainer.textContent = message;
    setTimeout(() => {
        messageContainer.textContent = '';
    }, 2000);
}

function endGame() {
    clearTimeout(gameInterval);
    clearTimeout(slowTimeTimeout);
    clearTimeout(doublePointsTimeout);
    isSlowTimeActive = false;
    isDoublePointsActive = false;

    const existingExpenses = gameArea.querySelectorAll('.expense');
    existingExpenses.forEach(expense => {
        clearInterval(expense.dataset.intervalId);
        if (gameArea.contains(expense)) {
            gameArea.removeChild(expense);
        }
    });

    finalScoreDisplay.textContent = score;
    gameContainer.style.display = 'none';
    endScreen.style.display = 'block';
    pandaSad();
    playSound(gameOverSound);
    createFireworks();
}

function pandaCheer() {
    panda.classList.add('cheer');
    setTimeout(() => panda.classList.remove('cheer'), 1000);
}

function pandaSad() {
    panda.classList.add('sad');
    setTimeout(() => panda.classList.remove('sad'), 1000);
}

function activateSlowTime() {
    isSlowTimeActive = true;
    slowTimeButton.disabled = true;
    const originalGameSpeed = gameSpeed;
    gameSpeed = 3000; // Slower speed
    playSound(powerUpSound);

    slowTimeTimeout = setTimeout(() => {
        isSlowTimeActive = false;
        gameSpeed = originalGameSpeed;
    }, 5000); // 5 seconds
}

function activateAutoSort() {
    autoSortButton.disabled = true;
    const expensesToSort = Array.from(gameArea.querySelectorAll('.expense')).slice(0, 3);
    playSound(powerUpSound);

    expensesToSort.forEach(expense => {
        const correctCategory = expense.dataset.category.toLowerCase();
        const targetBucket = document.getElementById(`${correctCategory}-bucket`);
        const rect = targetBucket.getBoundingClientRect();
        
        // Animate the expense to the bucket
        expense.style.transition = 'left 1s, top 1s';
        expense.style.left = `${rect.left + rect.width / 2 - expense.offsetWidth / 2}px`;
        expense.style.top = `${rect.top + rect.height / 2 - expense.offsetHeight / 2}px`;

        setTimeout(() => {
            if (gameArea.contains(expense)) {
                gameArea.removeChild(expense);
                updateScore(5);
            }
        }, 1000);
    });
}

function activateDoublePoints() {
    isDoublePointsActive = true;
    doublePointsButton.disabled = true;
    playSound(powerUpSound);

    doublePointsTimeout = setTimeout(() => {
        isDoublePointsActive = false;
    }, 10000); // 10 seconds
}

function playSound(sound) {
    if (sound.src) {
        sound.currentTime = 0;
        sound.play();
    }
}

function createFireworks() {
    for (let i = 0; i < 30; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;
        firework.style.animationDelay = `${Math.random() * 2}s`;
        endScreen.appendChild(firework);
    }
}