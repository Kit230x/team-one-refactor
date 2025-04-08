const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let snake, food, timer;
let score = 0;

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
    const rect = new Rect(i * 20, 0, 20, 20, "gray");
    this.snakeArry.unshift(rect);
  }
  this.head = this.snakeArry[0];
  this.head.color = "red";
  this.direction = 39;
}

Snake.prototype.draw = function () {
  for (let i = 0; i < this.snakeArry.length; i++) {
    this.snakeArry[i].draw();
  }
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
  } else {
    this.snakeArry.pop();
  }

  switch (this.direction) {
    case 37:
      this.head.x -= this.head.w;
      break;
    case 38:
      this.head.y -= this.head.h;
      break;
    case 39:
      this.head.x += this.head.w;
      break;
    case 40:
      this.head.y += this.head.h;
      break;
  }

  if (
    this.head.x < 0 ||
    this.head.y < 0 ||
    this.head.x >= canvas.width ||
    this.head.y >= canvas.height
  ) {
    clearInterval(timer);
    alert("Game Over: You hit the wall!");
    restartBtn.disabled = false;
  }

  for (let i = 1; i < this.snakeArry.length; i++) {
    if (
      this.snakeArry[i].x === this.head.x &&
      this.snakeArry[i].y === this.head.y
    ) {
      clearInterval(timer);
      alert("Game Over: You hit yourself!");
      restartBtn.disabled = false;
    }
  }
};

function getRandomFood() {
  let isOnSnake = true;
  let rect;
  while (isOnSnake) {
    isOnSnake = false;
    const indexX = getNumberInRange(0, canvas.width / 20);
    const indexY = getNumberInRange(0, canvas.height / 20);
    rect = new Rect(indexX * 20, indexY * 20, 20, 20, "green");
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
  context.clearRect(0, 0, canvas.width, canvas.height);
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
  clearInterval(timer);
  timer = setInterval(gameLoop, 150);
  restartBtn.disabled = false;
  startBtn.disabled = true;
}

function restartGame() {
  startGame();
}

document.onkeydown = function (e) {
  if (
    [37, 38, 39, 40].includes(e.keyCode) &&
    Math.abs(snake.direction - e.keyCode) !== 2
  ) {
    snake.direction = e.keyCode;
  }
};

startBtn.onclick = startGame;
restartBtn.onclick = restartGame;
