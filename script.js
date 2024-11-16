const boardSize = 15;
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const restartButton = document.getElementById('restart-btn');

let snake = [{ x: 8, y: 8 }];
let direction = { x: 0, y: 0 };
let food = { x: 3, y: 3 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;
let gameInterval;
const speed = 150; 
let gameStarted = false;

let obstacles = [];
const numObstacles = 5;
for (let i = 0; i < numObstacles; i++) {
  placeObstacle();
}

function createBoard() {
  gameBoard.innerHTML = '';

  snake.forEach((segment, index) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.classList.add('snake');
    if (index === 0) {
      snakeElement.classList.add('snake-head');
    }
    gameBoard.appendChild(snakeElement);
  });

  const foodElement = document.createElement('div');
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  foodElement.classList.add('food');
  gameBoard.appendChild(foodElement);

  obstacles.forEach(obstacle => {
    const obstacleElement = document.createElement('div');
    obstacleElement.style.gridColumnStart = obstacle.x;
    obstacleElement.style.gridRowStart = obstacle.y;
    obstacleElement.classList.add('obstacle');
    gameBoard.appendChild(obstacleElement);
  });
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 1 || head.x > boardSize ||
    head.y < 1 || head.y > boardSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y) ||
    obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert(`Game Over! Final Score: ${score}`);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  let overlap;
  do {
    overlap = false;
    food = {
      x: Math.floor(Math.random() * boardSize) + 1,
      y: Math.floor(Math.random() * boardSize) + 1,
    };
    if (
      snake.some(segment => segment.x === food.x && segment.y === food.y) ||
      obstacles.some(obstacle => obstacle.x === food.x && obstacle.y === food.y)
    ) {
      overlap = true;
    }
  } while (overlap);
}

function placeObstacle() {
  let overlap;
  do {
    overlap = false;
    const obstacle = {
      x: Math.floor(Math.random() * boardSize) + 1,
      y: Math.floor(Math.random() * boardSize) + 1,
    };
    if (
      snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) ||
      obstacles.some(existing => existing.x === obstacle.x && existing.y === obstacle.y)
    ) {
      overlap = true;
    } else {
      obstacles.push(obstacle);
    }
  } while (overlap);
}

function handleKeydown(event) {
  if (!gameStarted) {
    gameStarted = true;
    gameInterval = setInterval(gameLoop, speed);
  }

  switch (event.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

function restartGame() {
  clearInterval(gameInterval);
  snake = [{ x: 8, y: 8 }];
  direction = { x: 0, y: 0 };

  // Update high score
  highScore = Math.max(score, highScore);
  localStorage.setItem('highScore', highScore);
  highScoreElement.textContent = highScore;

  score = 0;
  scoreElement.textContent = score;

  obstacles = [];
  for (let i = 0; i < numObstacles; i++) {
    placeObstacle();
  }
  placeFood();
  gameStarted = false;
  createBoard();
}

function gameLoop() {
  moveSnake();
  createBoard();
}

document.addEventListener('keydown', handleKeydown);
restartButton.addEventListener('click', restartGame);

createBoard();