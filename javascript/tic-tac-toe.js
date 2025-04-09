const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartButton = document.querySelector("#restartButton");
const hotSeatButton = document.querySelector("#hotseat");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let difficulty = 0;
let compChoice = 9;


function hotSeatSelected() {
    difficulty = 0;
    restartGame();
}
function easySelected() {
    difficulty = 1;
    restartGame();
}
function mediumSelected() {
    difficulty = 2;
    restartGame();
}
function impossibleSelected() {
    difficulty = 3;
    restartGame();
}
function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartButton.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;

}
function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running) {
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();

}
function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;

}
function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
    // This method is also controlling CPU moves when not in hotseat mode
    if (difficulty == 1 && currentPlayer == "O") { // easy
        statusText.textContent = 'EASY MODE'
        computerChoice();
        

        checkWinner();

    } else if (difficulty == 2 && currentPlayer == "O") { // medium
        statusText.textContent = 'MEDIUM MODE'


        checkWinner();

    } else if (difficulty == 3 && currentPlayer == "O") { // impossible
        statusText.textContent = 'IMPOSSIBLE MODE'

        checkWinner();
    }
    

}
function checkWinner() {
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == "") {
            continue;
        }
        if(cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false; 
    } else if (!options.includes("")) {
        statusText.textContent = "Draw!";
        running = false;
    } else {
        changePlayer();
    }
}
function restartGame() {
    currentPlayer = "X"
    options = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    initializeGame();
}
function computerChoice() {
    
    compChoice = Math.floor(Math.random() * 9);

    if (options[compChoice] != "") {
        computerChoice();
    } else {
        options[compChoice] = currentPlayer;
        cells[compChoice].textContent = currentPlayer;

    }


}