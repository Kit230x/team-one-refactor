// breakout game. has demos for keyboard controls, collision detection, and more.
// I disabled mouse controls because I don't think they fit and also I couldn't be bothered to fix an issue with paddle going off canvas

"use strict";
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let gameState = "start"; // handles what screen should be displayed (start, playing, win, game over)

const ball = {
    x: (canvas.width / 2), 
    y: 0, // placeholder
    radius: 10,
    dx: 100,
    dy: -100,
    nextX: 0,
    nextY: 0,
    color: "#0095DD"
};

let deltaTime = 0;

function getNextX(deltaTime) {
    ball.nextX = (ball.x + ball.dx * deltaTime);
    return ball.nextX;
}

function getNextY(deltaTime) {
    ball.nextY = (ball.y + ball.dy * deltaTime);
    return ball.nextY;
}



const paddle = {
    height: 10,
    width: 125,
    x: 0, // placeholder, dependent on width and can't be assigned yet
    y: canvas.height - 20,
    delta: 200,
    color: "#0095DD",
    type: "paddle"
};

paddle.x = (canvas.width - paddle.width) / 2;
ball.y = paddle.y - ball.radius - 2;

// used for ball going off screen
const offscreenBuffer = 20;

// keyboard control booleans
let rightPressed = false;
let leftPressed = false;

// defines amount of bricks
const brickRowCount = 3;
const brickColumnCount = 5;

// 2D bricks array
// padding makes sure bricks don't touch their neighbors,
// top and left offsets make sure they don't touch canvas edges
const bricks = [];
for (let cols = 0; cols < brickColumnCount; cols++) {
    bricks[cols] = [];
    for (let rows = 0; rows < brickRowCount; rows++) {
        bricks[cols][rows] = { x: 0, y: 0, width: 75, height: 20, type: "brick", padding: 10, offsetTop: 30, offsetLeft: 30, status: (Math.floor(Math.random() * 2)) + 1 };
    }
}

let interval = 0;

// pixel buffer between messages on start, win, and game over screens
let messageBuffer = 40;

let score = 0;

let lives = 3;

// returns random hexadecimal color value
// this could be fixed somehow to prevent colors that are too light. figure out what part of hex code is responsible for light colors
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// boolean param is for capture vs bubbling phase for DOM (idk how this works)
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// keyboard input event handler functions
// ArrowLeft/ArrowRight is for most browsers, Left and Right are for IE/Edge
// "a" and "A" are distinct keyboard events - using e.code would break given different keyboard layouts,
// and using e.key wouldn't work if the user had caps lock or the shift key active
// when keydown event is fired, keyDownHandler() is called, same for keyup and keyUpHandler()
function keyDownHandler(e) {
    if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        leftPressed = true;
    }
    else if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        rightPressed = true;
    }

    if (e.key === " " || e.code === "Space") {
        if (gameState === "start" || gameState === "win" || gameState === "gameover") {
            resetGame();
            gameState = "playing";
        }
    }
}

function keyUpHandler(e) {
    if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        leftPressed = false;
    }
    else if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        rightPressed = false;
    }
}

// this utilizes swept collision detection- checks for future collisions (objects in path) 
function sweptCollisionDetection(toBeChecked) {
    // guard statement to prevent excess scoring bug
    if (toBeChecked.type === "brick" && toBeChecked.status === 0) return;

    const isInX = (getNextX(deltaTime) + ball.radius >= toBeChecked.x && getNextX(deltaTime) - ball.radius <= toBeChecked.x + toBeChecked.width);
    const isInY = (getNextY(deltaTime) + ball.radius >= toBeChecked.y && getNextY(deltaTime) - ball.radius <= toBeChecked.y + toBeChecked.height);



    if (isInX && isInY) {
        const pixelBuffer = 1;

        const overlapLeft = Math.abs((ball.x + ball.radius) - (toBeChecked.x + pixelBuffer));
        const overlapRight = Math.abs((ball.x - ball.radius) - (toBeChecked.x + toBeChecked.width - pixelBuffer));
        const overlapTop = Math.abs((ball.y + ball.radius) - (toBeChecked.y + pixelBuffer));
        const overlapBottom = Math.abs((ball.y - ball.radius) - (toBeChecked.y + toBeChecked.height - pixelBuffer));
        
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        if (minOverlapX < minOverlapY) {
            ball.dx = -ball.dx;
        } else {
            ball.dy = -ball.dy;
        }

        if (toBeChecked.type === "brick") {
            if (toBeChecked.status === 2) {
                toBeChecked.status--;
            } else {
                toBeChecked.status = 0;
                score++;
            }
        }
    
        if (toBeChecked.type === "paddle") {
            // puttin some english on it !! "not" checks are to make sure paddle isn't against the wall (ie not moving)
            if (leftPressed && !(paddle.x === 0)) {
                ball.dx -= 100;
            } else if (rightPressed && !(paddle.x + paddle.width === canvas.width)) {
                ball.dx += 100;
            }

            if (ball.dy > 0) {
                ball.y = paddle.y - ball.radius - 2; // 2 helps prevent weird collisions with paddle
            }
        }

        ball.color = getRandomColor();

        return true; // collision happened
    }
    return false; // no collision detected
}

let gameOverTriggered = false; // Add this at the top-level

function wallCollision(deltaTime) {
    // ball collision detection
    // checks if x value goes over or under the width, if so- reverses direction (ball.dx)
    if (ball.x + ball.dx * deltaTime > canvas.width - ball.radius || ball.x + ball.dx * deltaTime < ball.radius) {
        ball.dx = -ball.dx;
        ball.color = getRandomColor();
    }
    // checks if y value goes under the height, if so- reverses direction (ball.dy)
    if (ball.y + ball.dy * deltaTime > canvas.height + offscreenBuffer) {
        lives--;
        if (lives < 0) lives = 0;

        if (lives === 0 && !gameOverTriggered) {
            gameOverTriggered = true; // Prevent multiple calls
            setTimeout(() => {
                gameState = "gameover";
                saveGameSession('breakout', score); // Save score on game over
            }, 500);
            return;
        }

        resetBall();
    }
}


function ballMovement(deltaTime) {
    // this clamps the speed value between 3 and 11, then assigns the appropriate sign
    const minSpeed = 100;
    const maxSpeed = 200;
    const clampSpeed = (value) => {
        const sign = Math.sign(value); // returns 1 or -1
        const magnitude = Math.max(minSpeed, Math.min(Math.abs(value), maxSpeed));
        return sign * magnitude;
    }

    ball.dx = clampSpeed(ball.dx);
    ball.dy = clampSpeed(ball.dy);

    ball.nextX = (ball.x + ball.dx * deltaTime);
    ball.nextY = (ball.y + ball.dy * deltaTime);

    ball.x += ball.dx * deltaTime;
    ball.y += ball.dy * deltaTime;
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Score: ${score}`, 8, 8); // numbers are x and y for text
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 8, 8); // numbers are x and y for text
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    // params - starting x y coords, ending x y coords
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}

// checks if brick has status of 1 or 0. if status == 1, brick is drawn. if status == 0, brick is destroyed (never drawn again)
function drawBricks() {
    for (let cols = 0; cols < brickColumnCount; cols++) {
        for (let rows = 0; rows < brickRowCount; rows++) {
            // purple- two hits left
            if (bricks[cols][rows].status === 2) {
                bricks[cols][rows].x = cols * (bricks[cols][rows].width + bricks[cols][rows].padding) + bricks[cols][rows].offsetLeft;
                bricks[cols][rows].y = rows * (bricks[cols][rows].height + bricks[cols][rows].padding) + bricks[cols][rows].offsetTop;
                ctx.beginPath();
                ctx.rect(bricks[cols][rows].x, bricks[cols][rows].y, bricks[cols][rows].width, bricks[cols][rows].height);
                ctx.fillStyle = "#A020F0";
                ctx.fill();
                ctx.closePath();
            }

            // blue- about to break
            if (bricks[cols][rows].status === 1) {
                bricks[cols][rows].x = cols * (bricks[cols][rows].width + bricks[cols][rows].padding) + bricks[cols][rows].offsetLeft;
                bricks[cols][rows].y = rows * (bricks[cols][rows].height + bricks[cols][rows].padding) + bricks[cols][rows].offsetTop;
                ctx.beginPath();
                ctx.rect(bricks[cols][rows].x, bricks[cols][rows].y, bricks[cols][rows].width, bricks[cols][rows].height);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


// different game state screens
function drawStartScreen() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "center";
    ctx.fillText("Let's play Breakout!", (canvas.width / 2), ((canvas.height / 2)));
    ctx.font = "18px Arial";
    ctx.fillText("Press SPACE to play", (canvas.width / 2), ((canvas.height / 2) + messageBuffer));
}

function drawWinScreen() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "center";
    ctx.fillText("Congratulations, you won!", (canvas.width / 2), ((canvas.height / 2)));
    ctx.font = "18px Arial";
    ctx.fillText("Press SPACE to play again", (canvas.width / 2), ((canvas.height / 2) + messageBuffer));
}

function drawGameOverScreen() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "center";
    ctx.fillText("Uh oh... you lost!", (canvas.width / 2), ((canvas.height / 2)));
    ctx.font = "18px Arial";
    ctx.fillText("Press SPACE to try again", (canvas.width / 2), ((canvas.height / 2) + messageBuffer));
}

function resetBall() {
    ball.x = paddle.x + (paddle.width / 2);
    ball.y = paddle.y - ball.radius - 2;
    ball.dx = 300;
    ball.dy = -300;
    ball.color = "#0095DD";
    console.log(ball.x);
    console.log(canvas.width);
    console.log(paddle.x);
}

function resetGame() {
    // paddle reset
    paddle.x = (canvas.width - paddle.width) / 2;

    // ball reset to original values
    resetBall();

    // reset the bricks. the only properties that needs to be reset is the status
    for (let cols = 0; cols < brickColumnCount; cols++) {
        for (let rows = 0; rows < brickRowCount; rows++) {
            bricks[cols][rows].status = (Math.floor(Math.random() * 2)) + 1;
        }
    }

    score = 0;
    lives = 3;
}

let lastTime = Date.now();
let gameWinTriggered = false; // Add this flag at the top

function draw() {
    const now = Date.now();
    let deltaTime = (now - lastTime) / 1000; // deltaTime in seconds
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "start") {
        drawStartScreen();
        requestAnimationFrame(draw);
        return;
    } else if (gameState === "win") {
        drawWinScreen();
        saveGameSession('breakout', score); // Save score on win
        requestAnimationFrame(draw);
        return;
    } else if (gameState === "gameover") {
        drawGameOverScreen();
        requestAnimationFrame(draw);
        return;
    }

    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawBricks();

    // brick collision detection
    let collidedThisFrame = false;
    for (let cols = 0; cols < brickColumnCount && !collidedThisFrame; cols++) {
        for (let rows = 0; rows < brickRowCount && !collidedThisFrame; rows++) {
            const brick = bricks[cols][rows];
            if (sweptCollisionDetection(brick)) {
                collidedThisFrame = true;
            }
        }
    }

    if (!collidedThisFrame) {
        sweptCollisionDetection(paddle);
    }
    wallCollision(deltaTime);
    ballMovement(deltaTime);

    // wall collision detection for paddle, ensures it stays inside canvas borders
    if (rightPressed) {
        paddle.x = Math.min(paddle.x + paddle.delta * deltaTime, canvas.width - paddle.width);
    } else if (leftPressed) {
        paddle.x = Math.max(paddle.x - paddle.delta * deltaTime, 0);
    }

    // win check. 100 at end is millisecond delay to allow browser to draw everything properly
    if (score === brickRowCount * brickColumnCount) {
        setTimeout(() => { gameState = "win" }, 500);
    }
    // smoother animation. matches framerate to system display
    requestAnimationFrame(draw);
}

draw();