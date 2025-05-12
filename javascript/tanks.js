// ANYTHING THAT MOVES NEEDS TO BE MULTIPLIED BY DELTA TIME!!! frames/second * pixels/frame = pixels/second
"use strict";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let gameState = "start";

class Tank {
    constructor(x, y, bodyColor, frontColor, turretColor, velocity, bodyAngle, turretAngle, input) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.bodyColor = bodyColor;
        this.frontColor = frontColor;
        this.velocity = velocity;
        this.bodyAngle = bodyAngle;
        this.turretWidth = 30;
        this.turretHeight = 10;
        this.turretOffset = 20;
        this.turretColor = turretColor;
        this.turretAngle = turretAngle;
        this.radius = Math.max(this.width, this.height) / 2;
        this.lastShotTime = 0;
        this.input = input;
    }
    draw() {
        const frontBuffer = 10;
        // the double save, translate, rotate, draw, restore routine might be redundant. I don't know. I know that it works.
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // center coordinates
        ctx.rotate(this.bodyAngle);
        // draw tank body
        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        // draw tank front
        ctx.fillStyle = this.frontColor;
        ctx.fillRect(this.width / 2, -this.height / 2, -frontBuffer, this.height);
        ctx.restore();
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        // draw barrel
        ctx.rotate(this.turretAngle);
        ctx.fillStyle = this.turretColor;
        ctx.fillRect((-this.turretWidth / 2) + this.turretOffset , -this.turretHeight / 2, this.turretWidth, this.turretHeight);
        ctx.restore();
    }
    isCollidingTankWall(x, y, bodyAngle, radius, deltaTime, forward) {
        let nextX = 0;
        let nextY = 0;
        if (forward) {
            nextX = x + Math.cos(bodyAngle) * this.velocity * deltaTime;
            nextY = y + Math.sin(bodyAngle) * this.velocity * deltaTime;
        } else {
            nextX = x - Math.cos(bodyAngle) * this.velocity * deltaTime;
            nextY = y - Math.sin(bodyAngle) * this.velocity * deltaTime;
        }
        
    
        const centerX = nextX + tankSize / 2;
        const centerY = nextY + tankSize / 2;
    
        const left = {x: nextX, y: centerY};
        const right = {x: nextX + this.width, y: centerY};
        const top = {x: centerX, y: nextY};
        const bottom = {x: centerX, y: nextY + this.height};
        const topLeft = {x: centerX + Math.cos((3 * Math.PI) / 4) * radius, y: centerY + Math.sin((3 * Math.PI) / 4) * radius};
        const topRight = {x: centerX + Math.cos((Math.PI) / 4) * radius, y: centerY + Math.sin((Math.PI) / 4) * radius};
        const bottomLeft = {x: centerX + Math.cos((5 * Math.PI) / 4) * radius, y: centerY + Math.sin((5 * Math.PI) / 4) * radius};
        const bottomRight = {x: centerX + Math.cos((7 * Math.PI) / 4) * radius, y: centerY + Math.sin((7 * Math.PI) / 4) * radius};
    
        const pointsToCheck = [left, right, top, bottom, topLeft, topRight, bottomLeft, bottomRight];
    
        for (let point of pointsToCheck) { // for...of
            const col = Math.floor(point.x / tileSize);
            const row = Math.floor(point.y / tileSize);
            if (row < 0 || row >= map.length || col < 0 || col >= map[0].length || map[row][col] === 1) {
                return true;
            }
        }
        return false;
    }
    update(deltaTime, inputState) {
        let nextX = this.x;
        let nextY = this.y;

        // forward and backward tank movement
        if (this.input.forward) {
            nextX += Math.cos(this.bodyAngle) * this.velocity * deltaTime;
            nextY += Math.sin(this.bodyAngle) * this.velocity * deltaTime;
        }
        if (this.input.backward) {
            nextX -= Math.cos(this.bodyAngle) * this.velocity * deltaTime;
            nextY -= Math.sin(this.bodyAngle) * this.velocity * deltaTime;
        }

        // collision check, won't move if detects imminent collision
        let collision = false;
        for (let other of tanks) { // for...of loop
            if (other !== this) { // won't check for collision with itself
                if (isCollidingTwoTanks({x: nextX, y: nextY, radius: this.radius, width: tankSize, height: tankSize}, other)) { // have to manually pass properties because x and y are different 
                    collision = true;
                    break;
                }
            }
        }

        if (!collision && !this.isCollidingTankWall(nextX, nextY, this.bodyAngle, this.radius, deltaTime, this.input.direction)) {
            this.x = nextX;
            this.y = nextY; 
        }

        // tank left/right rotation movement
        if (this.input.left) {
            if (inputState.direction) {
                this.bodyAngle -= angleDelta * deltaTime;
                if (!(this.input.rotateTurretLeft || this.input.rotateTurretRight)) {
                    this.turretAngle -= angleDelta * deltaTime;
                }
            } else {
                this.bodyAngle += angleDelta * deltaTime;
                if (!(this.input.rotateTurretLeft || this.input.rotateTurretRight)) {
                    this.turretAngle += angleDelta * deltaTime;
                }
            } 
        }
        if (this.input.right) {
            if (inputState.direction) {
                this.bodyAngle += angleDelta * deltaTime;
                if (!(this.input.rotateTurretLeft || this.input.rotateTurretRight)) {
                    this.turretAngle += angleDelta * deltaTime;
                }
            } else {
                this.bodyAngle -= angleDelta * deltaTime;
                if (!(this.input.rotateTurretLeft || this.input.rotateTurretRight)) {
                    this.turretAngle -= angleDelta * deltaTime;
                }
            }
        }
        // turret rotation
        if (this.input.rotateTurretLeft) {
            this.turretAngle -= angleDelta * deltaTime;
        }
        if (this.input.rotateTurretRight) {
            this.turretAngle += angleDelta * deltaTime;
        }
    }
    shoot() {
        const tankCenterX = this.x + this.width / 2;
        const tankCenterY = this.y + this.height / 2;

        const barrelLength = this.turretOffset + this.turretWidth / 2;

        const turretTipX = tankCenterX + Math.cos(this.turretAngle) * barrelLength;
        const turretTipY = tankCenterY + Math.sin(this.turretAngle) * barrelLength;
    
        bullets.push({
            x: turretTipX,
            y: turretTipY,
            angle: this.turretAngle,
            speed: bulletSpeed,
            radius: bulletRadius,
            status: 6,
            source: this
        });
    }
    canShoot(input) {
        if (input.shoot) {
            const now = Date.now();
            if (now - this.lastShotTime > bulletCooldown) {
                this.shoot();
                this.lastShotTime = now;
            }
        }
    }
}

class PlayerTank extends Tank {
    constructor(x, y, bodyColor, frontColor, turretColor, velocity, bodyAngle, turretAngle, input) {
        super(x, y, bodyColor, frontColor, turretColor, velocity, bodyAngle, turretAngle, input);
        this.type = 'player';
        this.input = input;
        this.lives = 3;
    }
}

let tankSize = 40;

// 32 columns per row, with 18 rows
const map = [
  // 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 3
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 4
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 5
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 6
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 7
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1], // 8
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], // 9
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1], // 10
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1], // 11
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], // 12
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1], // 13
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 14
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 15
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 16
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 17
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // 18
];

const tileSize = 40;

function drawMap() {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = '#71816d';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

// player one inputs
let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;
let spacePressed = false;
let fPressed = false;
let gPressed = false;
let playerOneLastForward = true;

// player two inputs
let upPressed = false;
let leftPressed = false;
let downPressed = false;
let rightPressed = false;
let pPressed = false;
let iPressed = false;
let oPressed = false;
let playerTwoLastForward = true;

const playerOneInput = {
    forward: wPressed,
    backward: sPressed,
    left: aPressed,
    right: dPressed,
    rotateTurretLeft: fPressed,
    rotateTurretRight: gPressed,
    shoot: spacePressed,
    direction: playerOneLastForward
};

const playerTwoInput = {
    forward: upPressed,
    backward: downPressed,
    left: leftPressed,
    right: rightPressed,
    rotateTurretLeft: iPressed,
    rotateTurretRight: oPressed,
    shoot: pPressed,
    direction: playerTwoLastForward
}

function updateInputStates() {
    playerOneInput.forward = wPressed;
    playerOneInput.backward = sPressed;
    playerOneInput.left = aPressed;
    playerOneInput.right = dPressed;
    playerOneInput.rotateTurretLeft = fPressed;
    playerOneInput.rotateTurretRight = gPressed;
    playerOneInput.shoot = spacePressed;
    playerOneInput.direction = playerOneLastForward;

    playerTwoInput.forward = upPressed;
    playerTwoInput.backward = downPressed;
    playerTwoInput.left = leftPressed;
    playerTwoInput.right = rightPressed;
    playerTwoInput.rotateTurretLeft = iPressed;
    playerTwoInput.rotateTurretRight = oPressed;
    playerTwoInput.shoot = pPressed;
    playerTwoInput.direction = playerTwoLastForward;
}

// this will change how fast the tank/turret rotates (in radians)
let angleDelta = 1.5;

let tankVelocity = 100;

let leftSpawnX = 80;
let leftSpawnY = 380;
let leftSpawnBodyAngle = 0;
let leftSpawnTurretAngle = 0;
let rightSpawnX = canvas.width - 120;
let rightSpawnY = 380;
let rightSpawnBodyAngle = Math.PI;
let rightSpawnTurretAngle = Math.PI;

// player one and two creation
const playerOne = new PlayerTank(leftSpawnX, leftSpawnY, "#94ff81", "#283618", "#fefae0", tankVelocity, leftSpawnBodyAngle, leftSpawnTurretAngle, playerOneInput);
const playerTwo = new PlayerTank(rightSpawnX, rightSpawnY, "#8d99ae", "#2b2d42", "#edf2f4", tankVelocity, rightSpawnBodyAngle, rightSpawnTurretAngle, playerTwoInput);

// color themes:
// format: body, frontBody, turret
// forest: player one: "#606c38", "#283618", "#fefae0", player two: "#2b2d42", "#8d99ae", "#edf2f4"
// star wars:
// tron: 
//

let tanks = [];
tanks.push(playerOne);
tanks.push(playerTwo);

// consider moving these to the tank class
let bullets = [];
const bulletSpeed = 500;
const bulletRadius = 3;
const bulletCooldown = 500; // used for fire rate cooldown stuff

// this is for delta time calculations
let lastTime = Date.now();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "w" || e.key === "W") {
        wPressed = true;
        playerOneLastForward = true;
    }
    if (e.key === "a" || e.key === "A") {
        aPressed = true;
    }
    if (e.key === "s" || e.key === "S") {
        sPressed = true;
        playerOneLastForward = false;
    }
    if (e.key === "d" || e.key === "D") {
        dPressed = true;
    }
    if (e.code === "Space") {
        spacePressed = true;
    }
    if (e.key === "f" || e.key === "F") {
        fPressed = true;
    }
    if (e.key === "g" || e.key === "G") {
        gPressed = true;
    }
    if (e.key === "ArrowUp") {
        upPressed = true;
        playerTwoLastForward = true;
    }
    if (e.key === "ArrowLeft") {
        leftPressed = true;
    }
    if (e.key === "ArrowDown") {
        downPressed = true;
        playerTwoLastForward = false;
    }
    if (e.key === "ArrowRight") {
        rightPressed = true;
    }
    if (e.key === "p" || e.key === "P") {
        pPressed = true;
    }
    if (e.key === "i" || e.key === "I") {
        iPressed = true;
    }
    if (e.key === "o" || e.key === "O") {
        oPressed = true;
    }
    if (e.key === "Enter") {
        if (gameState === "start" || gameState === "win") {
            resetGame();
            gameState = "playing";
        }
    }
}

function keyUpHandler(e) {
    if (e.key === "w" || e.key === "W") {
        wPressed = false;
    }
    if (e.key === "a" || e.key === "A") {
        aPressed = false;
    }
    if (e.key === "s" || e.key === "S") {
        sPressed = false;
    }
    if (e.key === "d" || e.key === "D") {
        dPressed = false;
    }
    if (e.code === "Space") {
        spacePressed = false;
    }
    if (e.key === "f" || e.key === "F") {
        fPressed = false;
    }
    if (e.key === "g" || e.key === "G") {
        gPressed = false;
    }
    if (e.key === "ArrowUp") {
        upPressed = false;
    }
    if (e.key === "ArrowLeft") {
        leftPressed = false;
    }
    if (e.key === "ArrowDown") {
        downPressed = false;
    }
    if (e.key === "ArrowRight") {
        rightPressed = false;
    }
    if (e.key === "p" || e.key === "P") {
        pPressed = false;
    }
    if (e.key === "i" || e.key === "I") {
        iPressed = false;
    }
    if (e.key === "o" || e.key === "O") {
        oPressed = false;
    }
}

function updateBullets(deltaTime) {
    // loop through all of the bullets
    // for its x, multiply cos of bullet.angle by bulletSpeed, same thing for y (with sin), and then +=
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        let reflected = false;

        const nextX = bullet.x + Math.cos(bullet.angle) * bulletSpeed * deltaTime;
        const nextY = bullet.y + Math.sin(bullet.angle) * bulletSpeed * deltaTime;

        // horizontal collision with wall. checks next x with current y
        const colX = Math.floor(nextX / tileSize);
        const rowY = Math.floor(bullet.y / tileSize);
        if (map[rowY] && map[rowY][colX] === 1) {
            bullet.angle = Math.PI - bullet.angle;
            reflected = true;
        }

        // vertical collision with wall. checks current x with next y
        const colX2 = Math.floor(bullet.x / tileSize);
        const rowY2 = Math.floor(nextY / tileSize);
        if (map[rowY2] && map[rowY2][colX2] === 1) {
            bullet.angle = -bullet.angle;
            reflected = true;
        }

        if (reflected) {
            bullet.status--;
            if (bullet.status < 0) {
                bullet.status = 0;
            }
            if (bullet.status === 0) {
                bullets.splice(bullet, 1);
            }
        }

        reflected = false;

        bullet.x += Math.cos(bullet.angle) * bulletSpeed * deltaTime;
        bullet.y += Math.sin(bullet.angle) * bulletSpeed * deltaTime;

        for (let j = 0; j < tanks.length; j++) {
            const tank = tanks[j];
            if (isCollidingTankBullet(tank, bullet) && bullet.source !== tank) {
                const hitTank = tanks[j];
                const enemyTank = tanks.find(t => t !== hitTank);
                bullets.splice(i, 1);
                respawn(tanks[j], enemyTank);
                break;
            }
        }
    }
}

function drawBullets() {
    // loop through the bullets array
    // draw bullet[i] with whatever color and ctx.beginPath(), ctx.arc(), and ctx.closePath()
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.beginPath();
        ctx.fillStyle = bullet.source.bodyColor;
        console.log(ctx.fillStyle);
        ctx.arc(bullet.x, bullet.y, bulletRadius, 0, Math.PI * 2); // x coord, y coord, radius, start angle, end angle
        ctx.fill();
        ctx.closePath();
    }
}

function isCollidingTankBullet(tank, bullet) {
    const dx = (tank.x + tank.width / 2) - bullet.x;
    const dy = (tank.y + tank.height / 2) - bullet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < tank.radius + bullet.radius;
}

function isCollidingTwoTanks(tankOne, tankTwo) {
    const dx = (tankOne.x + tankOne.width / 2) - (tankTwo.x + tankTwo.width / 2);
    const dy = (tankOne.y + tankOne.height / 2) - (tankTwo.y + tankTwo.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < tankOne.radius + tankTwo.radius;
}

function respawn(tank, enemyTank) {
    // check what side of the map the enemy tank is on (enemyTank.x < canvas.width / 2)
    // change x and y of dead to spawn position
    // tank.lives--
    // reset relevant tank properties (positioning)
    // reset: x, y, bodyAngle, turretAngle, all inputs
    if (enemyTank.x + enemyTank.width / 2 > canvas.width / 2) { // left spawn
        tank.x = leftSpawnX;
        tank.y = leftSpawnY;
        tank.bodyAngle = leftSpawnBodyAngle;
        tank.turretAngle = leftSpawnTurretAngle;
        tank.input.direction = true;
    } else { // right spawn
        tank.x = rightSpawnX;
        tank.y = rightSpawnY;
        tank.bodyAngle = rightSpawnBodyAngle;
        tank.turretAngle = rightSpawnTurretAngle;
        tank.input.direction = true;
    }
    tank.lives--;
    if (tank.lives < 0) tank.lives = 0;
    if (tank.lives === 0) {
        gameState = "win";
    }
}

const messageBuffer = 100;

function drawStartScreen() {
    ctx.font = "48px Arial";
    ctx.fillStyle = "#71816d";
    ctx.textAlign = "center";
    ctx.fillText("Welcome to Tanks!", (canvas.width / 2), ((canvas.height / 2) - messageBuffer));
    ctx.font = "36px Arial";
    ctx.fillText("Press ENTER to play", (canvas.width / 2), ((canvas.height / 2)));
}

function drawWinScreen() {
    ctx.font = "48px Arial";
    ctx.fillStyle = "#71816d";
    ctx.textAlign = "center";
    if (playerOne.lives === 0) {
        if (playerTwo.lives === 0) {
            ctx.fillText("It's a tie!", (canvas.width / 2), ((canvas.height / 2) - messageBuffer));
        }
        ctx.fillText("Player Two Wins!", (canvas.width / 2), ((canvas.height / 2) - messageBuffer));
    }
    if (playerTwo.lives === 0) {
        ctx.fillText("Player One Wins!", (canvas.width / 2), ((canvas.height / 2) - messageBuffer));
    }
    
    ctx.font = "36px Arial";
    ctx.fillText("Press ENTER to play again", (canvas.width / 2), ((canvas.height / 2)));
}

function drawLives(tankOneLives, tankTwoLives) {
    const offset = 20;
    const iconSize = 40;
    const playerOneLives = {x: offset, y: offset, width: iconSize, height: iconSize, color: playerOne.color};
    const playerTwoLives = {x: canvas.width - offset * 3, y: offset, width: iconSize, height: iconSize, color: playerTwo.color};

    for (let i = 0; i < tankOneLives; i++) {
        ctx.fillStyle = playerOne.bodyColor;
        ctx.fillRect(playerOneLives.x + i * 60, playerOneLives.y, playerOneLives.width, playerOneLives.height);
    }

    for (let i = 0; i < tankTwoLives; i++) {
        ctx.fillStyle = playerTwo.bodyColor;
        ctx.fillRect(playerTwoLives.x - i * 60, playerTwoLives.y, playerTwoLives.width, playerTwoLives.height);
    }

}

function resetGame() {
    // reset player positions
    playerOne.x = leftSpawnX;
    playerOne.y = leftSpawnY;
    playerOne.bodyAngle = leftSpawnBodyAngle;
    playerOne.turretAngle = leftSpawnTurretAngle;
    playerOne.input.direction = true;
    playerOne.lives = 3;

    playerTwo.x = rightSpawnX;
    playerTwo.y = rightSpawnY;
    playerTwo.bodyAngle = rightSpawnBodyAngle;
    playerTwo.turretAngle = rightSpawnTurretAngle;
    playerTwo.input.direction = true;
    playerTwo.lives = 3;

    // empty bullet array
    bullets = [];
}

function draw() {
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000; // deltaTime in seconds
    lastTime = now;

    updateInputStates();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "start") {
        drawStartScreen();
        requestAnimationFrame(draw);
        return;
    } else if (gameState === "win") {
        drawWinScreen();
        requestAnimationFrame(draw);
        return;
    }

    drawMap();
    drawLives(playerOne.lives, playerTwo.lives);

    updateBullets(deltaTime);
    drawBullets();

    tanks.forEach(tank => {
        tank.update(deltaTime, tank.input);
        tank.draw();
        tank.canShoot(tank.input);
    });
    // for (let i = 0; i < tanks.length; i++) {
    //     let tank = tanks[i];
    //     tank.update(deltaTime, tank.input);
    //     tank.draw();
    //     tank.canShoot(tank.input); // only shoots if deltaTime > bulletCooldown
    // }

    requestAnimationFrame(draw);
}

draw();