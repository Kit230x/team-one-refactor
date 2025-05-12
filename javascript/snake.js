let board;
let context;

const cellSize = 40;
const cols = 12;
const rows = 12;
const boardWidth = cellSize * cols;
const boardHeight = cellSize * rows;

let scoreDisplay = document.getElementById("scoreDisplay");
let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("restartBtn");
let gameOverMessage = document.getElementById("gameOverMessage");
let difficultySelect = document.getElementById("difficulty");

let snake, food, timer;
let score = 0;
let baseSpeed = 150;
let speed = baseSpeed;
let gameMode = "easy";

function Rect(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
}

Rect.prototype.draw = function () {
  context.beginPath();
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.w, this.h);
};

function Snake() {
  this.snakeArry = [];
  for (let i = 0; i < 4; i++) {
    const segment = new Rect(i * cellSize, 0, cellSize, cellSize, "gray");
    this.snakeArry.unshift(segment);
  }
  this.head = this.snakeArry[0];
  this.head.color = "red";
  this.direction = 39;
}

Snake.prototype.draw = function () {
  for (let i = 0; i < this.snakeArry.length; i++) {
    const segment = this.snakeArry[i];
    segment.color = i % 2 === 0 ? "#4CAF50" : "#81C784";
    segment.draw();
  }
  this.head.color = "#FF5252";
  this.head.draw();
};

Snake.prototype.move = function () {
  const newHead = new Rect(
    this.head.x,
    this.head.y,
    this.head.w,
    this.head.h,
    "gray"
  );
  this.snakeArry.splice(1, 0, newHead);

  if (isEat()) {
    food = getRandomFood();
    score++;
    updateScore();

    if (gameMode === "hard" && score % 5 === 0 && speed > 60) {
      speed -= 10;
      clearInterval(timer);
      timer = setInterval(gameLoop, speed);
    }
  } else {
    this.snakeArry.pop();
  }

  switch (this.direction) {
    case 37: this.head.x -= this.head.w; break;
    case 38: this.head.y -= this.head.h; break;
    case 39: this.head.x += this.head.w; break;
    case 40: this.head.y += this.head.h; break;
  }

  if (
    this.head.x < 0 ||
    this.head.y < 0 ||
    this.head.x >= boardWidth ||
    this.head.y >= boardHeight
  ) {
    clearInterval(timer);
    endGame("Game Over: You hit the wall!"); // Use the endGame function
    return; // Important: stop further execution of move
  }

  for (let i = 1; i < this.snakeArry.length; i++) {
    if (
      this.snakeArry[i].x === this.head.x &&
      this.snakeArry[i].y === this.head.y
    ) {
      clearInterval(timer);
      endGame("Game Over: You hit yourself!"); // Use the endGame function
      return; // Important: stop further execution of move
    }
  }
};

function getRandomFood() {
  let isOnSnake = true;
  let rect;
  while (isOnSnake) {
    isOnSnake = false;
    const indexX = getNumberInRange(0, cols);
    const indexY = getNumberInRange(0, rows);
    rect = new Rect(indexX * cellSize, indexY * cellSize, cellSize, cellSize, "red");
    for (let i = 0; i < snake.snakeArry.length; i++) {
      if (snake.snakeArry[i].x === rect.x && snake.snakeArry[i].y === rect.y) {
        isOnSnake = true;
        break;
      }
    }
  }
  return rect;
}

function getNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function isEat() {
  return snake.head.x === food.x && snake.head.y === food.y;
}

function drawAll() {
  context.fillStyle = "#7f9f60";
  context.fillRect(0, 0, boardWidth, boardHeight);

  context.strokeStyle = "#444";
  context.lineWidth = 0.7;
  for (let x = 0; x < boardWidth; x += cellSize) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, boardHeight);
    context.stroke();
  }
  for (let y = 0; y < boardHeight; y += cellSize) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(boardWidth, y);
    context.stroke();
  }

  food.draw();
  snake.draw();
}

function updateScore() {
  scoreDisplay.innerText = "Score: " + score;
}

function gameLoop() {
  snake.move();
  drawAll();
}

function startGame() {
  snake = new Snake();
  food = getRandomFood();
  score = 0;
  updateScore();
  speed = baseSpeed;
  gameMode = difficultySelect.value;
  clearInterval(timer);
  timer = setInterval(gameLoop, speed);
  restartBtn.disabled = false;
  startBtn.disabled = true;
  gameOverMessage.innerText = "";
  gameOverMessage.style.display = "none";
}

function restartGame() {
  startGame();
}

function endGame(message) {
  console.log('endGame function called');
  clearInterval(timer);
  gameOverMessage.innerText = message;
  gameOverMessage.style.display = "block";
  restartBtn.disabled = false;

  console.log('Current user in endGame:', firebase.auth().currentUser); // Add this line
  saveGameScore('snake', score);
}

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  startBtn.onclick = startGame;
  restartBtn.onclick = restartGame;
};

document.onkeydown = function (e) {
  const keyMap = {
    87: 38, // W
    83: 40, // S
    65: 37, // A
    68: 39  // D
  };
  const newDir = keyMap[e.keyCode];
  if (newDir && Math.abs(snake.direction - newDir) !== 2) {
    snake.direction = newDir;
  }
};

function endGame(message) {
  console.log('endGame function called');
  console.log('Current user in endGame:', firebase.auth().currentUser);
  saveGameScore('snake', score);

  clearInterval(timer);
  gameOverMessage.innerText = message;
  gameOverMessage.style.display = "block";
  restartBtn.disabled = false;
}