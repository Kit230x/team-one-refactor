let board;
let score = 0;
let rows = 4;
let columns = 4;

// RIGID ANIMATION TESTING
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());

let position = 0;
function animate() {
    position += 1;
    document.getElementById('myElement').style.transform = `translateX(${position}px)`;

    if (position < 300) {
        requestAnimationFrame(animate);
    }
}

requestAnimationFrame(animate);

window.onload = function () {
    setGame();
};

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    document.getElementById("board").innerHTML = ''; // Clear the board
    document.getElementById("score").innerText = score; // Reset Score Display
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
            updateTile(tile, board[r][c]); //update the tile
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = num > 0 ? num.toString() : "";
    tile.className = "tile";
    if (num > 0) {
        tile.classList.add(`x${num <= 4096 ? num : 8192}`);
    }
}

// ARROW KEY MOVEMENT
document.addEventListener("keyup", (e) => {
    let moved = false;

    if (e.code === "ArrowLeft") {
        moved = slideLeft();
    } else if (e.code === "ArrowRight") {
        moved = slideRight();
    } else if (e.code === "ArrowUp") {
        moved = slideUp();
    } else if (e.code === "ArrowDown") {
        moved = slideDown();
    }

    if (moved) {
        setTimeout(setTwo, 200);
        const scoreDisplay2048 = document.getElementById('score');
        if (scoreDisplay2048) {
            scoreDisplay2048.innerText = score;
        }
        if (!canMove()) {
            gameOver();
        }
    } else if (!canMove()) {
        gameOver();
    }
});

function filterZero(row) {
    return row.filter(num => num !== 0);
}

function slide(row, direction) {
    let originalRow = [...row];
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    while (row.length < columns) {
        if (direction === "right" || direction === "down") {
            row.unshift(0);
        } else {
            row.push(0);
        }
    }
    return row;
}

function animateTileMovement(tile, fromX, fromY, toX, toY) {
    let tileSize = 100;
    tile.style.transform = `translate(${(toX - fromX) * tileSize}px, ${(toY - fromY) * tileSize}px)`;

    setTimeout(() => {
        tile.style.transform = "translate(0, 0)";
    }, 200);
}


// **Slide Left**
function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let originalRow = [...board[r]];
        let newRow = slide(board[r]);
        board[r] = newRow;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            if (originalRow[c] !== num) {
                animateTileMovement(tile, 100, 0, 0, 0);
                moved = true;
            }
            updateTile(tile, num);
        }
    }
    return moved;
}

// SLIDE RIGHT
function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let originalRow = [...board[r]];
        let newRow = slide(board[r].reverse()).reverse();
        board[r] = newRow;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            if (originalRow[c] !== num) {
                animateTileMovement(tile, -100, 0, 0, 0);
                moved = true;
            }
            updateTile(tile, num);
        }
    }
    return moved;
}

// SLIDE UP
function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let originalColumn = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newColumn = slide(originalColumn);

        for (let r = 0; r < rows; r++) {
            if (board[r][c] !== newColumn[r]) moved = true;
            board[r][c] = newColumn[r];
            updateTile(document.getElementById(`${r}-${c}`), board[r][c]);
        }
    }
    return moved;
}

// SLIDE DOWN
function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let originalColumn = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newColumn = slide(originalColumn.slice().reverse()).reverse();

        for (let r = 0; r < rows; r++) {
            if (board[r][c] !== newColumn[r]) moved = true;
            board[r][c] = newColumn[r];
            updateTile(document.getElementById(`${r}-${c}`), board[r][c]);
        }
    }
    return moved;
}

function setTwo() {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = 2;
            let tile = document.getElementById(`${r}-${c}`);
            tile.innerText = "2";
            tile.classList.add("x2");
            tile.style.opacity = "0";
            setTimeout(() => tile.style.opacity = "1", 100);
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) return true;
        }
    }
    return false;
}

function canMove() {
     if (hasEmptyTile()) {
        return true;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] === board[r][c + 1]) {
                return true;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] === board[r + 1][c]) {
                return true;
            }
        }
    }
    return false;
}

function gameOver() {
    alert(`Game Over! Your final score is ${score}`);
    let restartButton = document.getElementById("restart-button");
    if (!restartButton) {
        restartButton = document.createElement("button");
        restartButton.id = "restart-button";
        restartButton.innerText = "Restart Game";
        restartButton.onclick = () => {
            window.location.reload();
        };
        const boardContainer = document.getElementById("board-container");
        if (boardContainer) {
            boardContainer.appendChild(restartButton);
        }
    } else {
        restartButton.style.display = "block";
        restartButton.onclick = () => {
            window.location.reload();
        };
    }
    saveGameSession('2048 game', score); 
}