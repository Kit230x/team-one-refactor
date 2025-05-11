

var playerRed ="R";
var playerYellow = "Y";
var currentPlayer = playerRed;

var gameOver = false;
var board;
var currentColumns;

var rows = 6;
var columns = 7;

window.onload = function() {
    startGame();
}

function reload() {
    location.reload();
}

function startGame() {
    board = [];
    currentColumns = [5, 5, 5, 5, 5, 5, 5]

    for(let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {

            row.push(' ');


            //HTML
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece)
            document.getElementById("board").append(tile);


        }
        board.push(row);
    }
}

function setPiece() {
    if (gameOver) { return;} //add restart here instead of return?

    let description = document.getElementById("description");
    let coords = this.id.split("-"); //creates array holding row and collumn
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currentColumns[c];
    if (r < 0) { return } // checks if column is already full

    board[r][c] = currentPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString()); // places piece in lowwest empty spot
    if (currentPlayer == playerRed) {
        tile.classList.add("red-piece");
        currentPlayer = playerYellow;
        description.innerText = "Yellow's Turn";
    } else {
        tile.classList.add("yellow-piece");
        currentPlayer = playerRed;
        description.innerText = "Red's Turn";
    }

    r -= 1;
    currentColumns[c] = r; // updates what is full

    checkWinner()
}

function checkWinner() {
    //horizontal checks

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns -3; c++) {
            if (board[r][c] != ' ') { // checks if space has a piece in it to even check
                if (board[r][c] == board[r][c + 1] && board[r][c + 1] == board[r][c + 2] && board[r][c + 2] == board[r][c + 3]) { // check if four consecutive horizontal spaces are the same
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    //vertical checks

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') { // checks if space has a piece
                if (board[r][c] == board[r + 1][c] && board[r + 1][c] == board[r + 2][c] && board[r + 2][c] == board[r + 3][c]) { // checks for consecutive verticals
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    //down right diagnal check

    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') { // checks if space has a piece
                if (board[r][c] == board[r + 1][c + 1] && board[r + 1][c + 1] == board[r + 2][c + 2] && board[r + 2][c + 2] == board[r + 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    //up right diagnal check

    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') { // checks if space has a piece
                if (board[r][c] == board[r - 1][c + 1] && board[r - 1][c + 1] == board[r - 2][c + 2] && board[r -2][c + 2] == board[r - 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

function setWinner(r, c) {
    let description = document.getElementById("description");

    if (board[r][c] == playerRed) {
        description.innerText = "Red Wins!"
    } else {
        description.innerText = "Yellow Wins!"
    }
    gameOver = true;
}