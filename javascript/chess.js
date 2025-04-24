
document.addEventListener("DOMContentLoaded", async () => {
    initializeBoard();
    displayGameOptions();
    const gameOptions = await waitForStartClick();
});

function initializeBoard() {
    const files = ['a','b','c','d','e','f','g','h'];
    const board = document.getElementsByClassName('chess-board');
    
    for (let row = 8; row >= 1; row--) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.id = files[col] + row;

            const isWhite = (row + col) % 2 === 0;
            square.className = `${isWhite ? 'white' : 'black'} square`;

            rowDiv.appendChild(square);
        }

        board.appendChild(rowDiv);
    }
}

function displayGameOptions() {
    /* 
    TODO: 
        Implement game options display for...
        - player color (black or white)
        - opponent difficulty (easy, medium, hard)
        - time limit (5, 10, 15 or unlimted)
    */
}

function waitForStartClick() {
    return new Promise((resolve) => {
        // Setup listeners
        setupOptionGroup(".color-option", (value) => selectedColor = value);
        setupOptionGroup(".difficulty-option", (value) => selectedDifficulty = value);
        setupOptionGroup(".time-limit-option", (value) => selectedTime = value);

        // Pre-select defaults
        let selectedColor = document.querySelector(".color-option.selected").textContent;
        let selectedDifficulty = document.querySelector(".difficulty-option.selected").textContent;
        let selectedTime = document.querySelector(".time-limit-option.selected").textContent;

        // Upon clicking the start button, resolve with the current options
        document.getElementById("start-btn").addEventListener("click", () => {
            const options = {
                playerColor: selectedColor,
                opponentDifficulty: selectedDifficulty,
                timeLimit: parseInt(selectedTime),
            };
            resolve(options);
        });

        // When the user clicks on an option, update the selected value
        function setupOptionGroup(selector, setSelected) {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    buttons.forEach((btn) => btn.classList.remove("selected"));
                    button.classList.add("selected");
                    setSelected(button.textContent);
                });
            });
        }
    });
}


