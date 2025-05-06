const choices = ["rock", "paper", "scissors"];

const playerDisplay = document.getElementById("playerDisplay");
const computerDisplay = document.getElementById("computerDisplay");
const resultDisplay = document.getElementById("resultDisplay");

let currentDifficulty = "Easy"; // default
let hotseatTurn = "Player 1";   // for hotseat mode

// Set up radio button listeners for difficulty selection
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
difficultyRadios.forEach(radio => {
    radio.addEventListener("change", (event) => {
        currentDifficulty = event.target.value;
        initializeGame(currentDifficulty);
    });
});

// Initializes or resets game state based on difficulty
function initializeGame(difficulty) {
    console.log("Game initialized with difficulty:", difficulty);

    if (difficulty === "Hotseat") {
        hotseatTurn = "Player 1";
        resultDisplay.textContent = "Hotseat mode: Player 1's turn";
        computerDisplay.textContent = ""; // no computer move in hotseat
    } else {
        resultDisplay.textContent = `You selected ${difficulty}.`;
    }
}

// Main game logic
function playRPS(playerChoice) {
    if (currentDifficulty === "Hotseat") {
        handleHotseatPlay(playerChoice);
        return;
    }

    const computerChoice = getComputerChoice(playerChoice, currentDifficulty);

    let result = "";

    if (playerChoice === computerChoice) {
        result = "IT'S A TIE!";
    } else {
        switch(playerChoice) {
            case "rock":
                result = (computerChoice === "scissors") ? "YOU WIN!" : "YOU LOSE!";
                break;
            case "paper":
                result = (computerChoice === "rock") ? "YOU WIN!" : "YOU LOSE!";
                break;
            case "scissors":
                result = (computerChoice === "paper") ? "YOU WIN!" : "YOU LOSE!";
                break;
        }
    }

    playerDisplay.textContent = `PLAYER: ${playerChoice}`;
    computerDisplay.textContent = `COMPUTER: ${computerChoice}`;
    resultDisplay.textContent = result;
}

// AI logic based on difficulty
function getComputerChoice(playerChoice, difficulty) {
    if (difficulty === "Easy") {
        return choices[Math.floor(Math.random() * 3)];
    }

    if (difficulty === "Medium") {
        // 50/50 chance to pick randomly or counter the player
        const isSmartMove = Math.random() < 0.5;
        if (isSmartMove) return getCounterChoice(playerChoice);
        return choices[Math.floor(Math.random() * 3)];
    }

    if (difficulty === "Impossible") {
        return getCounterChoice(playerChoice);
    }

    return choices[Math.floor(Math.random() * 3)];
}

// Returns the move that beats the player's
function getCounterChoice(playerChoice) {
    switch(playerChoice) {
        case "rock": return "paper";
        case "paper": return "scissors";
        case "scissors": return "rock";
    }
}
// playerDisplay.textContent = `PLAYER 1: ${playerChoice}`;
// Hotseat mode handler
function handleHotseatPlay(playerChoice) {
    if (hotseatTurn === "Player 1") {
        playerDisplay.textContent = `PLAYER 1: Secret...`;
        resultDisplay.textContent = "Hotseat mode: Player 2's turn";
        hotseatTurn = "Player 2";
        playerDisplay.setAttribute("playerOneChoice", playerChoice);
    } else {
        
        const p1Choice = playerDisplay.getAttribute("playerOneChoice");
        const p2Choice = playerChoice;
        playerDisplay.textContent = `PLAYER 1: ${p1Choice}`;
        computerDisplay.textContent = `PLAYER 2: ${p2Choice}`;

        let result = "";
        
        if (p1Choice === p2Choice) {
            result = "IT'S A TIE!";
        } else {
            switch(p1Choice) {
                case "rock":
                    result = (p2Choice === "scissors") ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!";
                    break;
                case "paper":
                    result = (p2Choice === "rock") ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!";
                    break;
                case "scissors":
                    result = (p2Choice === "paper") ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!";
                    break;
            }
        }

        resultDisplay.textContent = result;
        hotseatTurn = "Player 1";
    }
}
