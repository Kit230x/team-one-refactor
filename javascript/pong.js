const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "forestgreen";
const paddle1Color = "lightblue";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 50;
let intervalID;
let ballSpeed = 1;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;

let paddle1 = { 
    width: 25,
    height: 100,
    x: 0,
    y: 0
};

let paddle2 = { 
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100
};

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    createBall();
    nextTick();
};

function nextTick(){
    intervalID = setTimeout(() => {
        nextTick();
    }, 10)
};

clearBoard();
drawPaddles();
moveBall();
drawBall(ballX, ballY) {
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
};

checkCollision() {
    if(ballY <= 0 + ballRadius) {
        ballYDirection *= -1;
    }
    if(ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }
    if(ballX <= 0) {
        player2Score += 1;
        updateScore();
        createBall();
        return;
    }
    if(ballX >= gameWidth) {
        player1Score += 1;
        updateScore();
        createBall();
        return;
    }
    if(ballX <= (paddle1.x + paddle1.width + ballRadius)) {
        if(ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            ballXDirection *= -1;
        }
    }
    if(ballX >= (paddle2.x + paddle2.width + ballRadius)) {
        if(ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            ballXDirection *= -1;
        }
    }
};

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function drawPaddles(ballX, ballY){
    ctx.strokeStyle = paddleBoarder;

    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

};

function createBall(){
    ballSpped = 1;
    if(Math.round(Math.random()) == 1) {
        ballXDirection = 1;
    } else {
        ballXDirection = -1;
    }
    if(Math.round(Math.random()) == 1) {
        ballYDrection = 1;
    } else {
        ballYDirection = -1;
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);

};
function moveBall(){
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYDirection);
};
function drawBall(){};
function checkCollision(){};
function changeDirection() {
    const keyPressed = event.keyCode;
    const paddleUp = 87;
    const paddleDown = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;

    switch(keyPressed) {
        case(paddle1Up):
            if(paddle1.y > 0) {
                paddle1.y -= paddleSpeed;
            }
            break;
        case(paddle1Down):
            if(paddle1.u < gameHeight - paddle1.height) {
                paddle1.y += paddleSpeed;
            }
            break;
        case(paddle2Up):
            if(paddle2.y > 0) {
                paddle2.y -= paddleSpeed;
            }
            break;
        case(paddle2Down):
            if(paddle2.u < gameHeight - paddle2.height) {
                paddle2.y += paddleSpeed;
            }
            break;
    }
};

function updateScore(){};
function resetGame(){};