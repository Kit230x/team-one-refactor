// Piece class
class Piece {
    constructor(color, position, imagePath) {
    this.color = color;
    this.position = position;
    this.imagePath = imagePath;
    this.hasMoved = false;
    }

    render(squareElement) {
        squareElement.style.backgroundImage = `url('${this.imagePath}')`;
        squareElement.style.backgroundSize = "cover";
        squareElement.style.backgroundPosition = "center";
    }

    move(newPos) {
        this.position = newPos;
        this.hasMoved = true;
    }

    getSlidingMoves(board, directions) {
        const [row, col] = this.position;
        const moves = [];
        for (const [dr, dc] of directions) {
            let r = row + dr, c = col + dc;
            while (board.isValidPosition([r, c])) {
            const target = board.getPiece([r, c]);
            if (!target) {
                moves.push([r, c]);
            } else {
                if (target.color !== this.color) moves.push([r, c]);
                break;
            }
            r += dr; c += dc;
            }
        }
        return moves;
    }
}

class Pawn extends Piece {
    getAvailableSquares(board) {
        const [r, c] = this.position;
        const dir = this.color === "white" ? -1 : 1;
        const moves = [];

        // 正常前进
        const one = [r + dir, c];
        if (board.isEmpty(one)) {
            moves.push(one);
            const two = [r + 2 * dir, c];
            if (!this.hasMoved && board.isEmpty(two)) {
            moves.push(two);
            }
        }

        // 正常吃子
        for (let dc of [-1, 1]) {
            const pos = [r + dir, c + dc];
            const target = board.getPiece(pos);
            if (target && target.color !== this.color) moves.push(pos);
        }

        // 吃过路兵
        if (
            board.enPassantTarget &&
            board.enPassantTarget[0] === r + dir &&
            Math.abs(board.enPassantTarget[1] - c) === 1
        ) {
            moves.push(board.enPassantTarget);
        }

        return moves;
    }
}

class Rook extends Piece {
    getAvailableSquares(board) {
        return this.getSlidingMoves(board, [[1,0],[-1,0],[0,1],[0,-1]]);
    }
}

class Bishop extends Piece {
    getAvailableSquares(board) {
        return this.getSlidingMoves(board, [[1,1],[1,-1],[-1,1],[-1,-1]]);
    }
}

class Queen extends Piece {
    getAvailableSquares(board) {
        return this.getSlidingMoves(board, [
            [1,0],[-1,0],[0,1],[0,-1],
            [1,1],[1,-1],[-1,1],[-1,-1]
        ]);
    }
}

class Knight extends Piece {
    getAvailableSquares(board) {
        const [r, c] = this.position;
        const deltas = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];
        return deltas
            .map(([dr, dc]) => [r+dr, c+dc])
            .filter(pos => board.isValidPosition(pos) &&
            (!board.getPiece(pos) || board.getPiece(pos).color !== this.color));
    }
}

class King extends Piece {
    getAvailableSquares(board) {
        const [r, c] = this.position;
        const deltas = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
        const moves = deltas
            .map(([dr, dc]) => [r+dr, c+dc])
            .filter(pos => board.isValidPosition(pos) &&
            (!board.getPiece(pos) || board.getPiece(pos).color !== this.color));

        // 王车易位
        const back = this.color === "white" ? 7 : 0;
        if (!this.hasMoved && r === back && c === 4) {
            // 短易位
            const kingside = [[back, 5], [back, 6]];
            const rook = board.getPiece([back, 7]);
            if (rook instanceof Rook && !rook.hasMoved && kingside.every(board.isEmpty)) {
            moves.push([back, 6]);
            }
            // 长易位
            const queenside = [[back, 3], [back, 2], [back, 1]];
            const rook2 = board.getPiece([back, 0]);
            if (rook2 instanceof Rook && !rook2.hasMoved && queenside.every(board.isEmpty)) {
            moves.push([back, 2]);
            }
        }

        return moves;
    }
}

// tools
const boardElement = document.getElementById("chessboard");
const IMAGE_PATH = "img/gameimg/chess/";

let piecesOnBoard = [];
let selectedPiece = null;
let currentTurn = "white";
let enPassantTarget = null;
let gameOver = false;

// tools
function isValidPosition([r, c]) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getPiece([r, c]) {
    return piecesOnBoard.find(p => p.position[0] === r && p.position[1] === c);
}

function isEmpty(pos) {
    return !getPiece(pos);
}

function renderBoard() {
    boardElement.innerHTML = "";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
        const sq = document.createElement("div");
        sq.className = "square " + ((r + c) % 2 === 0 ? "light" : "dark");
        sq.dataset.row = r;
        sq.dataset.col = c;

        const piece = getPiece([r, c]);
        if (piece) piece.render(sq);

        boardElement.appendChild(sq);
        }
    }

    const turnText = document.getElementById("turn");
    if (turnText) {
        turnText.textContent = `Current Turn:${currentTurn === "white" ? "White" : "Black"}`;
    }
}

function clearHighlights() {
    document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
}

function setupInitialBoard() {
    piecesOnBoard = [];
    const layout = [
        ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],
        Array(8).fill("pawn"),
        ...Array(4).fill(Array(8).fill("")),
        Array(8).fill("pawn"),
        ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    ];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
        const type = layout[r][c];
        if (!type) continue;
        const color = r < 2 ? "black" : "white";
        const pos = [r, c];
        const img = `${IMAGE_PATH}${color[0].toUpperCase()}${type}.png`;

        let piece;
        switch (type) {
            case "pawn": piece = new Pawn(color, pos, img); break;
            case "rook": piece = new Rook(color, pos, img); break;
            case "knight": piece = new Knight(color, pos, img); break;
            case "bishop": piece = new Bishop(color, pos, img); break;
            case "queen": piece = new Queen(color, pos, img); break;
            case "king": piece = new King(color, pos, img); break;
        }

        piecesOnBoard.push(piece);
        }
    }

    renderBoard();
}
// Check
function isCheck(color) {
    const king = piecesOnBoard.find(p => p instanceof King && p.color === color);
    if (!king) return false;
    return piecesOnBoard.some(p =>
        p.color !== color &&
        p.getAvailableSquares({ isEmpty, isValidPosition, getPiece }).some(
        pos => pos[0] === king.position[0] && pos[1] === king.position[1]
        )
    );
}

function isCheckmate(color) {
    return !piecesOnBoard.some(p => {
        if (p.color !== color) return false;
        const allMoves = p.getAvailableSquares({ isEmpty, isValidPosition, getPiece });
        return allMoves.some(move => {
        const orig = p.position.slice();
        const captured = getPiece(move);
        const backup = [...piecesOnBoard];
        if (captured) piecesOnBoard = piecesOnBoard.filter(x => x !== captured);
        p.position = move;
        const stillSafe = !isCheck(color);
        p.position = orig;
        piecesOnBoard = backup;
        return stillSafe;
        });
    });
}

function checkKingAlive() {
    const whiteAlive = piecesOnBoard.some(p => p instanceof King && p.color === "white");
    const blackAlive = piecesOnBoard.some(p => p instanceof King && p.color === "black");
    if (!whiteAlive || !blackAlive) {
        gameOver = true;
        const winner = whiteAlive ? "White" : "Black";
        alert(`${winner} wins by capturing the king!`);
        return true;
    }
    return false;
}

function switchPlayer() {
    currentTurn = currentTurn === "white" ? "black" : "white";
}

// click
boardElement.addEventListener("click", (e) => {
    if (gameOver) return;

    const sq = e.target.closest(".square");
    if (!sq) return;

    const r = +sq.dataset.row;
    const c = +sq.dataset.col;
    const clicked = getPiece([r, c]);
    // r
    if (selectedPiece && sq.classList.contains("highlight")) {
        const originCol = selectedPiece.position[1]; 

        // 吃过路兵
        if (selectedPiece instanceof Pawn && enPassantTarget &&
            enPassantTarget[0] === r && enPassantTarget[1] === c) {
            const victimRow = selectedPiece.position[0];  
            const victim = getPiece([victimRow, c]);
            if (victim) piecesOnBoard = piecesOnBoard.filter(p => p !== victim);
        }

        // 正常吃子
        const target = getPiece([r, c]);
        if (target && target.color !== selectedPiece.color) {
            piecesOnBoard = piecesOnBoard.filter(p => p !== target);
        }

        // 升变
        if (selectedPiece instanceof Pawn && (r === 0 || r === 7)) {
            const q = new Queen(selectedPiece.color, [r, c], `${IMAGE_PATH}${selectedPiece.color[0].toUpperCase()}queen.png`);
            piecesOnBoard = piecesOnBoard.filter(p => p !== selectedPiece);
            piecesOnBoard.push(q);
        } else {
            selectedPiece.move([r, c]);
        }

        // 王车
        if (selectedPiece instanceof King && Math.abs(c - originCol) === 2) {
            const back = selectedPiece.color === "white" ? 7 : 0;
            if (c === 6) {
                const rook = getPiece([back, 7]);
                if (rook) rook.move([back, 5]);
            } else if (c === 2) {
                const rook = getPiece([back, 0]);
                if (rook) rook.move([back, 3]);
            }
        }

        // 路过吃
        if (selectedPiece instanceof Pawn && Math.abs(r - selectedPiece.position[0]) === 2) {
            enPassantTarget = [r - (selectedPiece.color === "white" ? 1 : -1), c];
        } else {
            enPassantTarget = null;
        }

        selectedPiece = null;
        clearHighlights();
        

        // Check
        if (isCheck(currentTurn)) {
            if (isCheckmate(currentTurn)) {
                alert(`${currentTurn} Checkmate! Game Over.`);
                gameOver = true;
                return;
            } else {
                alert(`${currentTurn} is in check!`);
            }
        }

        switchPlayer();
        renderBoard();

        if (checkKingAlive()) return;

        maybeTriggerAI();

        return;
    }

    clearHighlights();
    if (clicked && clicked.color === currentTurn) {
        selectedPiece = clicked;
        const moves = clicked.getAvailableSquares({ isEmpty, isValidPosition, getPiece });
        for (const [r1, c1] of moves) {
        const s = document.querySelector(`.square[data-row='${r1}'][data-col='${c1}']`);
        if (s) s.classList.add("highlight");
        }
    }
});

// load
window.onload = () => {
setupInitialBoard();
};

// gameMode
let gameMode = "local";

const modeSelect = document.getElementById("mode");
if (modeSelect) {
    gameMode = modeSelect.value;
    modeSelect.addEventListener("change", () => {
        gameMode = modeSelect.value;
    });
}
// AI moves
function getAllLegalMoves(color) {
    const moves = [];
    for (const piece of piecesOnBoard) {
    if (piece.color !== color) continue;
    const available = piece.getAvailableSquares({ isEmpty, isValidPosition, getPiece });
    for (const move of available) {
        moves.push({ piece, from: [...piece.position], to: move });
    }
    }
    return moves;
}

function makeAIMove(difficulty = "easy") {
    const moves = getAllLegalMoves(currentTurn);
    if (moves.length === 0) {
    alert(`${currentTurn} has no legal moves!`);
    gameOver = true;
    return;
    }

    let chosen;

    if (difficulty === "easy") {
    
    chosen = moves[Math.floor(Math.random() * moves.length)];
    } else if (difficulty === "normal") {
    
    chosen = moves
        .map(m => {
        const target = getPiece(m.to);
        const score = target ? getPieceValue(target) : 0;
        return { ...m, score };
        })
        .sort((a, b) => b.score - a.score)[0];
    }

    if (!chosen) return;

    selectedPiece = chosen.piece;
    executeMove(chosen.piece, chosen.to); 
}

function executeMove(piece, [r, c]) {   
    const originCol = piece.position[1];
    const target = getPiece([r, c]);
    if (target && target.color !== piece.color) {
        piecesOnBoard = piecesOnBoard.filter(p => p !== target);
    }

    if (piece instanceof Pawn && enPassantTarget &&
        enPassantTarget[0] === r && enPassantTarget[1] === c) {
        const victimRow = piece.position[0];  
        const victim = getPiece([victimRow, c]);
        if (victim) piecesOnBoard = piecesOnBoard.filter(p => p !== victim);
    }

    if (piece instanceof Pawn && (r === 0 || r === 7)) {
        const q = new Queen(piece.color, [r, c], `${IMAGE_PATH}${piece.color[0].toUpperCase()}queen.png`);
        piecesOnBoard = piecesOnBoard.filter(p => p !== piece);
        piecesOnBoard.push(q);
    } else {
        piece.move([r, c]);
    }

    if (piece instanceof King && Math.abs(c - originCol) === 2) {
        const back = piece.color === "white" ? 7 : 0;
        if (c === 6) {
            const rook = getPiece([back, 7]);
            if (rook) rook.move([back, 5]);
        } else if (c === 2) {
            const rook = getPiece([back, 0]);
            if (rook) rook.move([back, 3]);
        }
    }

    if (piece instanceof Pawn && Math.abs(r - piece.position[0]) === 2) {
        enPassantTarget = [r - (piece.color === "white" ? 1 : -1), c];
    } else {
        enPassantTarget = null;
    }

    selectedPiece = null;
    clearHighlights();

    if (isCheck(currentTurn)) {
        if (isCheckmate(currentTurn)) {
            alert(`${currentTurn} Checkmate! Game Over.`);
            gameOver = true;
            return;
        } else {
            alert(`${currentTurn} is in check!`);
        }
    }

    switchPlayer();
    renderBoard();
    maybeTriggerAI();
}
  

function getPieceValue(p) {
    if (p instanceof Queen) return 9;
    if (p instanceof Rook) return 5;
    if (p instanceof Bishop || p instanceof Knight) return 3;
    if (p instanceof Pawn) return 1;
    return 0;
}

function maybeTriggerAI() {
    if (gameOver) return;
    if (gameMode === "easy" && currentTurn === "black") {
        setTimeout(() => makeAIMove("easy"), 300);
    } else if (gameMode === "normal" && currentTurn === "black") {
        setTimeout(() => makeAIMove("normal"), 300);
    }
    console.log("AI triggered:", gameMode, currentTurn);

}
  

//  Reset 
document.getElementById("reset-btn").addEventListener("click", () => {
    
    piecesOnBoard = [];
    selectedPiece = null;
    currentTurn = "white";
    enPassantTarget = null;
    gameOver = false;

    setupInitialBoard();
    renderBoard();
    clearHighlights();

    const turnText = document.getElementById("turn");
    if (turnText) {
        turnText.textContent = "Turn: White";
    }
});
