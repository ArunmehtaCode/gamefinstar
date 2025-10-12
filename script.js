const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreDisplay = document.getElementById('final-score');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const gameArea = document.getElementById('game-area');

let score = 0;
let level = 1;
let gameSpeed = 2000;
let gameInterval;

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
    gameSpeed = 2000;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;

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
        if (gameArea.contains(element)) {
            gameArea.removeChild(element);
        }
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
    score += change;
    scoreDisplay.textContent = score;
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

    finalScoreDisplay.textContent = score;
    gameContainer.style.display = 'none';
    endScreen.style.display = 'block';
}