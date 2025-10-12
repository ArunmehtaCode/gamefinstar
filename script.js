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

let score = 0;
let level = 1;
let gameSpeed = 2000;
let gameInterval;
let combo = 0;

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

function startGame() {
    score = 0;
    level = 1;
    combo = 0;
    gameSpeed = 2000;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;

    startScreen.style.display = 'none';
    endScreen.style.display = 'none';
    gameContainer.style.display = 'block';

    const existingExpenses = gameArea.querySelectorAll('.expense');
    existingExpenses.forEach(expense => gameArea.removeChild(expense));

    gameInterval = setTimeout(gameLoop, gameSpeed);
}

function gameLoop() {
    createExpense();
    if (gameSpeed > 500) {
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

    makeDraggable(expenseElement, fallInterval);
}

function makeDraggable(element, fallInterval) {
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        clearInterval(fallInterval);
        element.classList.add('dragging');
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;

        function mouseMove(e) {
            element.style.left = `${e.clientX - gameArea.getBoundingClientRect().left - offsetX}px`;
            element.style.top = `${e.clientY - gameArea.getBoundingClientRect().top - offsetY}px`;
        }

        function mouseUp(e) {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            element.classList.remove('dragging');

            const droppedBucket = getDroppedBucket(e.clientX, e.clientY);
            if (droppedBucket) {
                handleDrop(element, droppedBucket.id.split('-')[0]);
            } else {
                endGame();
            }
             if(gameArea.contains(element)) {
                gameArea.removeChild(element);
            }
        }

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    });
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

    if (bucketCategory === correctCategory) {
        combo++;
        let bonus = 1;
        if (combo >= 5) bonus = 2;
        if (combo >= 10) bonus = 3;
        updateScore(5 * bonus);
        // Add character cheer animation
    } else {
        endGame();
    }
}

function updateScore(change) {
    score += change;
    scoreDisplay.textContent = score;

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
    finalScoreDisplay.textContent = score;
    gameContainer.style.display = 'none';
    endScreen.style.display = 'block';
}