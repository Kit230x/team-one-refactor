window.onload = function () {
    createBoard();
    insertImage();
    coloring();
    bindBoxes();
    bindReset();
    preventMultiSelect();
};



// createBoard
function createBoard() {
    const board = document.getElementById("board");
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.id = `b${row}${col}`; //  id
            board.appendChild(box); 
        }
    }
}
  
// Insert piece images based on innerText
function insertImage() {
    // Initial Layout
    const initialPieces = [
        ["WRook", "WKnight", "WBishop", "WQueen", "WKing", "WBishop", "WKnight", "WRook"],
        ["WPawn", "WPawn", "WPawn", "WPawn", "WPawn", "WPawn", "WPawn", "WPawn"],
        ["", "", "", "", "", "", "", ""],  
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["BPawn", "BPawn", "BPawn", "BPawn", "BPawn", "BPawn", "BPawn", "BPawn"],
        ["BRook", "BKnight", "BBishop", "BQueen", "BKing", "BBishop", "BKnight", "BRook"]
    ];
  
    // Iterate through the grid and place the pieces according to the initial layout
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const box = document.getElementById(`b${row}${col}`);
            const piece = initialPieces[row][col];
            if (piece !== "") {
                box.innerHTML = `<img class='all-img' src='/img/gameimg/chess/${piece}.png' alt='${piece}'>`;
            }
        }
    }
}
  
// Color alternating board squares
function coloring() {
    document.querySelectorAll('.box').forEach(cell => {
        const id = cell.id.slice(1);
        const col = parseInt(id.slice(-1));
        const row = parseInt(id.slice(0, id.length - 1));
        const sum = col + row;
        cell.style.backgroundColor = sum % 2 === 0 ? 'rgb(232 235 239)' : 'rgb(125 135 150)';
    });
}
  
// Reset button logic
function bindReset() {
    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            location.reload();
        });
    }
}
  
// Prevent selecting multiple elements
function preventMultiSelect() {
    let z = 0;
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', function () {
            z++;
            if (z % 2 === 0 && box.style.backgroundColor !== 'greenyellow') {
            coloring();
            }
        });
    });
}
  
// Bind click logic
function bindBoxes() {
    let tog = 1;
    document.querySelectorAll('.box').forEach(item => {
        item.addEventListener('click', function () {
            if (item.style.backgroundColor !== 'greenyellow') {
            toggleTurn();
            handlePieceMove(item, item.innerText, tog % 2 === 0 ? "B" : "W");
            tog++;
            }
        });
    });
}
  
// turn display
function toggleTurn() {
    const turnDisplay = document.getElementById("tog");
    if (turnDisplay) {
        turnDisplay.innerText = turnDisplay.innerText === "White's Turn" ? "Black's Turn" : "White's Turn";
    }
}
  
// movement and legality 
function handlePieceMove(box, pieceName, toggle) {
    switch (pieceName) {
        case `${toggle}pawn`:
            highlightPawnMoves(box, toggle);
            break;
        case `${toggle}rook`:
            highlightRookMoves(box, toggle);
            break;
        case `${toggle}knight`:
            highlightKnightMoves(box, toggle);
            break;
        case `${toggle}bishop`:
            highlightBishopMoves(box, toggle);
            break;
        case `${toggle}queen`:
            highlightQueenMoves(box, toggle);
            break;
        case `${toggle}king`:
            highlightKingMoves(box, toggle);
            break;
    }
}
  
// Move and eating
function movePiece(sourceBox, targetBox, toggle) {
    const targetPiece = targetBox.innerText;
    if (targetPiece && targetPiece[0] !== toggle) {
        targetBox.innerText = ""; // Remove the opponent's piece
    }
    targetBox.innerText = sourceBox.innerText; // Move to the target box
    sourceBox.innerText = ""; // Clear the source box
    insertImage();
    coloring();
}
  
// Highlight the available moves for pawns
function highlightPawnMoves(box, toggle) {
    const id = box.id.slice(1);
    const row = parseInt(id[0]);
    const col = parseInt(id[1]);
    const dir = toggle === 'W' ? 1 : -1;
  
    box.style.backgroundColor = 'blue';
  
    // Forward one step
    const forwardOne = document.getElementById(`b${row + dir}${col}`);
    if (forwardOne && forwardOne.innerText === "") {
        forwardOne.style.backgroundColor = 'greenyellow';
    }
  
    // Diagonal captures
    [col - 1, col + 1].forEach(c => {
        const diag = document.getElementById(`b${row + dir}${c}`);
        if (diag && diag.innerText && diag.innerText[0] !== toggle) {
            diag.style.backgroundColor = 'greenyellow'; 
            diag.addEventListener('click', function () {
            movePiece(box, diag, toggle);
            });
        }
    });
}
  
// Highlight the available moves for rooks
function highlightRookMoves(box, toggle) {
    const id = box.id.slice(1);
    const row = parseInt(id[0]);
    const col = parseInt(id[1]);
    box.style.backgroundColor = 'blue';
  
    for (let i = 1; i <= 8; i++) {
        const up = document.getElementById(`b${row + i}${col}`);
        if (up && up.innerText === "") up.style.backgroundColor = 'greenyellow';
        if (up && up.innerText[0] !== toggle) break;
    
        const down = document.getElementById(`b${row - i}${col}`);
        if (down && down.innerText === "") down.style.backgroundColor = 'greenyellow';
        if (down && down.innerText[0] !== toggle) break;
    
        const left = document.getElementById(`b${row}${col - i}`);
        if (left && left.innerText === "") left.style.backgroundColor = 'greenyellow';
        if (left && left.innerText[0] !== toggle) break;
    
        const right = document.getElementById(`b${row}${col + i}`);
        if (right && right.innerText === "") right.style.backgroundColor = 'greenyellow';
        if (right && right.innerText[0] !== toggle) break;
    }
}
  
// Highlight the available moves for knights
function highlightKnightMoves(box, toggle) {
    const id = box.id.slice(1);
    const row = parseInt(id[0]);
    const col = parseInt(id[1]);
    box.style.backgroundColor = 'blue';
  
    const moves = [
        [row + 2, col + 1], [row + 2, col - 1],
        [row - 2, col + 1], [row - 2, col - 1],
        [row + 1, col + 2], [row + 1, col - 2],
        [row - 1, col + 2], [row - 1, col - 2]
    ];
  
    moves.forEach(([r, c]) => {
        const moveBox = document.getElementById(`b${r}${c}`);
        if (moveBox) {
            if (moveBox.innerText === "") {
            moveBox.style.backgroundColor = 'greenyellow';
            } else if (moveBox.innerText[0] !== toggle) {
            moveBox.style.backgroundColor = 'greenyellow'; 
            }
        }
    });
}
  
// Highlight the available moves for bishops
function highlightBishopMoves(box, toggle) {
    const id = box.id.slice(1);
    const row = parseInt(id[0]);
    const col = parseInt(id[1]);
    box.style.backgroundColor = 'blue';
  
    for (let i = 1; i <= 8; i++) {
        const leftUp = document.getElementById(`b${row + i}${col - i}`);
        if (leftUp && leftUp.innerText === "") leftUp.style.backgroundColor = 'greenyellow';
        if (leftUp && leftUp.innerText[0] !== toggle) break;
    
        const rightUp = document.getElementById(`b${row + i}${col + i}`);
        if (rightUp && rightUp.innerText === "") rightUp.style.backgroundColor = 'greenyellow';
        if (rightUp && rightUp.innerText[0] !== toggle) break;
    
        const rightDown = document.getElementById(`b${row - i}${col + i}`);
        if (rightDown && rightDown.innerText === "") rightDown.style.backgroundColor = 'greenyellow';
        if (rightDown && rightDown.innerText[0] !== toggle) break;
    
        const leftDown = document.getElementById(`b${row - i}${col - i}`);
        if (leftDown && leftDown.innerText === "") leftDown.style.backgroundColor = 'greenyellow';
        if (leftDown && leftDown.innerText[0] !== toggle) break;
    }
}
  
// Highlight the available moves for queens
function highlightQueenMoves(box, toggle) {
    highlightRookMoves(box, toggle);
    highlightBishopMoves(box, toggle);
}
  
// Highlight the available moves for kings
function highlightKingMoves(box, toggle) {
    const id = box.id.slice(1);
    const row = parseInt(id[0]);
    const col = parseInt(id[1]);
    box.style.backgroundColor = 'blue';
  
    const moves = [
        [row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1],
        [row + 1, col + 1], [row + 1, col - 1], [row - 1, col + 1], [row - 1, col - 1]
    ];
  
    moves.forEach(([r, c]) => {
        const moveBox = document.getElementById(`b${r}${c}`);
        if (moveBox) {
            if (moveBox.innerText === "") {
            moveBox.style.backgroundColor = 'greenyellow';
            } else if (moveBox.innerText[0] !== toggle) {
            moveBox.style.backgroundColor = 'greenyellow'; 
            }
        }
    });
}
  