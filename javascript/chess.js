let gameMode; 
let tog = 1;
let z = 0;
let gameOver = false;
let whiteKingMoved = false;
let blackKingMoved = false;
let whiteRookLeftMoved = false;
let whiteRookRightMoved = false;
let blackRookLeftMoved = false;
let blackRookRightMoved = false;
let enPassantTarget = null;

window.onload = function () {
    gameMode = document.getElementById("mode").value;
    insertImage();
    coloring();
    reddish();
    bindResetButton();
    bindMainClick();
    bindBlueClick();
    bindColorResetClick();
    document.getElementById("mode").addEventListener("change", function () {
        gameMode = this.value;
    });
};

//inserting the images
function insertImage() {
    document.querySelectorAll('.box').forEach(image => {
        if (image.innerText.length !== 0) {
            if (image.innerText == 'Wpawn' || image.innerText == 'Bpawn') {
                image.innerHTML = `${image.innerText} <img class='all-img all-pown' src="/img/gameimg/chess/${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
            }
            else {
                image.innerHTML = `${image.innerText} <img class='all-img' src="/img/gameimg/chess/${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
            }
        }
    })
}

//Coloring the board

function coloring() {
    const color = document.querySelectorAll('.box')

    color.forEach(color => {
        getId = color.id
        arr = Array.from(getId)
        arr.shift()
        aside = eval(arr.pop())
        aup = eval(arr.shift())
        a = aside + aup

        if (a % 2 == 0) {
            color.style.backgroundColor = 'rgb(232 235 239)'
        }
        if (a % 2 !== 0) {
            color.style.backgroundColor = 'rgb(125 135 150)'
        }
    })
}



//function to not remove the same team element

function reddish() {
    document.querySelectorAll('.box').forEach(i1 => {
        if (i1.style.backgroundColor == 'blue') {

            document.querySelectorAll('.box').forEach(i2 => {

                if (i2.style.backgroundColor == 'greenyellow' && i2.innerText.length !== 0) {


                    greenyellowText = i2.innerText

                    blueText = i1.innerText

                    blueColor = ((Array.from(blueText)).shift()).toString()
                    greenyellowColor = ((Array.from(greenyellowText)).shift()).toString()

                    getId = i2.id
                    arr = Array.from(getId)
                    arr.shift()
                    aside = eval(arr.pop())
                    aup = eval(arr.shift())
                    a = aside + aup

                    if (a % 2 == 0 && blueColor == greenyellowColor) {
                        i2.style.backgroundColor = 'rgb(232 235 239)'
                    }
                    if (a % 2 !== 0 && blueColor == greenyellowColor) {
                        i2.style.backgroundColor = 'rgb(125 135 150)'
                    }

                }
            })
        }
    })
}

//reset button
function bindResetButton() {
    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            location.reload();
        });
    }
}



function bindMainClick() {
    document.querySelectorAll('.box').forEach(item => {

        if (gameOver) return;
    
        const piece = item.innerText;
        const isWhiteTurn = tog % 2 !== 0;  
        const isPlayerTurn =
            (gameMode === "local") || 
            (gameMode !== "local" && isWhiteTurn && piece.startsWith("W")) || 
            (gameMode !== "local" && !isWhiteTurn && piece.startsWith("B"));  

        if (!isPlayerTurn) return;


        item.addEventListener('click', function () {
    
            if (item.style.backgroundColor == 'greenyellow' && item.innerText.length == 0) {
                tog = tog + 1
            } else if (item.style.backgroundColor == 'greenyellow' && item.innerText.length !== 0) {
    
                document.querySelectorAll('.box').forEach(i => {
                    if (i.style.backgroundColor == 'blue') {
                        blueId = i.id
                        blueText = i.innerText
    
                        document.getElementById(blueId).innerText = ''
                        if (enPassantTarget && hathiTest2.id === enPassantTarget && blueText.endsWith('pawn')) {
                            const epCol = parseInt(hathiTest2.id[3]);
                            const epRow = parseInt(hathiTest2.id[2]);
                            const capturedRow = (tog % 2 !== 0) ? epRow - 1 : epRow + 1;
                            const capturedId = `b${capturedRow}${epCol}`;
                            document.getElementById(capturedId).innerText = ''; 

                        }
                        item.innerText = blueText

                        if (blueText.endsWith("pawn")) {
                            const row = parseInt(item.id[2]);
                            if ((blueText.startsWith("W") && row === 8) || (blueText.startsWith("B") && row === 1)) {
                                const color = blueText[0] === 'W' ? 'White' : 'Black';
                                const choice = prompt(
                                    `${color} pawn reached the last rank!\nChoose promotion:\n1 = Queen\n2 = Rook\n3 = Bishop\n4 = Knight`
                                );
                        
                                let promoted = blueText[0] + "queen"; // default
                                if (choice === "2") promoted = blueText[0] + "rook";
                                else if (choice === "3") promoted = blueText[0] + "bishop";
                                else if (choice === "4") promoted = blueText[0] + "knight";
                        
                                item.innerText = promoted;
                            }
                        }

                        if ((blueText === 'Wking' && (item.id === 'b107' || item.id === 'b103')) ||
                            (blueText === 'Bking' && (item.id === 'b807' || item.id === 'b803'))) {
                            executeCastling(blueId, item.id);
                        }
                        
                        enPassantTarget = null;
                        if (blueText.endsWith("pawn")) {
                            const startRow = blueText.startsWith("W") ? 2 : 7;
                            const endRow = blueText.startsWith("W") ? 4 : 5;

                            const fromRow = parseInt(blueId[2]);
                            const toRow = parseInt(item.id[2]);

                            if (fromRow === startRow && toRow === endRow) {
                                const col = blueId[3];
                                const midRow = (startRow + endRow) / 2;
                                enPassantTarget = `b${midRow}${col}`;
                            }
                        }

                        if (blueText === 'Wking') whiteKingMoved = true;
                        if (blueText === 'Bking') blackKingMoved = true;
                        if (blueText === 'Wrook' && blueId === 'b101') whiteRookLeftMoved = true;
                        if (blueText === 'Wrook' && blueId === 'b108') whiteRookRightMoved = true;
                        if (blueText === 'Brook' && blueId === 'b801') blackRookLeftMoved = true;
                        if (blueText === 'Brook' && blueId === 'b808') blackRookRightMoved = true;

                        coloring()
                        insertImage()
                        tog = tog + 1
    
                    }
                })
            }
    
    
    
            getId = item.id
            arr = Array.from(getId)
            arr.shift()
            aside = eval(arr.pop())
            arr.push('0')
            aup = eval(arr.join(''))
            a = aside + aup
    
            //function to display the available paths for all pieces
    
            function whosTurn(toggle) {
                // PAWN
    
                if (item.innerText == `${toggle}pawn`) {
                    item.style.backgroundColor = 'blue';
    
                    if (tog % 2 !== 0 && aup < 800) {
                        // First move for white pawns
                        if (document.getElementById(`b${a + 100}`).innerText.length == 0) {
                            document.getElementById(`b${a + 100}`).style.backgroundColor = 'greenyellow';
                            if (document.getElementById(`b${a + 200}`).innerText.length == 0 && aup < 300) {
                                document.getElementById(`b${a + 200}`).style.backgroundColor = 'greenyellow';
                            }
                        }
                        if (aside < 8 && document.getElementById(`b${a + 100 + 1}`).innerText.length !== 0) {
                            document.getElementById(`b${a + 100 + 1}`).style.backgroundColor = 'greenyellow';
                        }
                        if (aside > 1 && document.getElementById(`b${a + 100 - 1}`).innerText.length !== 0) {
                            document.getElementById(`b${a + 100 - 1}`).style.backgroundColor = 'greenyellow';
                        }
                    }
    
                    if (tog % 2 == 0 && aup > 100) {
                        // First move for black pawns
                        if (document.getElementById(`b${a - 100}`).innerText.length == 0) {
                            document.getElementById(`b${a - 100}`).style.backgroundColor = 'greenyellow';
                            if (document.getElementById(`b${a - 200}`).innerText.length == 0 && aup > 600) {
                                document.getElementById(`b${a - 200}`).style.backgroundColor = 'greenyellow';
                            }
                        }
                        if (aside < 8 && document.getElementById(`b${a - 100 + 1}`).innerText.length !== 0) {
                            document.getElementById(`b${a - 100 + 1}`).style.backgroundColor = 'greenyellow';
                        }
                        if (aside > 1 && document.getElementById(`b${a - 100 - 1}`).innerText.length !== 0) {
                            document.getElementById(`b${a - 100 - 1}`).style.backgroundColor = 'greenyellow';
                        }
                    }
                    // Second move for pawns
                    if (tog % 2 !== 0 && aup >= 800) {
                        if (document.getElementById(`b${a + 100}`).innerText.length == 0) {
                            document.getElementById(`b${a + 100}`).style.backgroundColor = 'greenyellow';
                        }
                        if (aside < 8 && document.getElementById(`b${a + 100 + 1}`).innerText.length !== 0) {
                            document.getElementById(`b${a + 100 + 1}`).style.backgroundColor = 'greenyellow';
                        }
                        if (aside > 1 && document.getElementById(`b${a + 100 - 1}`).innerText.length !== 0) {
                            document.getElementById(`b${a + 100 - 1}`).style.backgroundColor = 'greenyellow';
                        }
                    }
                    if (tog % 2 == 0 && aup <= 100) {
                        if (document.getElementById(`b${a - 100}`).innerText.length == 0) {
                            document.getElementById(`b${a - 100}`).style.backgroundColor = 'greenyellow';
                        }
                        if (aside < 8 && document.getElementById(`b${a - 100 + 1}`).innerText.length !== 0) {
                            document.getElementById(`b${a - 100 + 1}`).style.backgroundColor = 'greenyellow';
                        }
                        if (aside > 1 && document.getElementById(`b${a - 100 - 1}`).innerText.length !== 0) {
                            document.getElementById(`b${a - 100 - 1}`).style.backgroundColor = 'greenyellow';
                        }
                    }
                    if (enPassantTarget) {
                        const enPassantBox = document.getElementById(enPassantTarget);
                        const epId = enPassantBox.id;
                        const epCol = parseInt(epId[3]);
                        const epRow = parseInt(epId[2]);
                        const curCol = parseInt(item.id[3]);
                        const curRow = parseInt(item.id[2]);
                    
                        const forwardRow = (tog % 2 !== 0) ? curRow + 1 : curRow - 1;
                    
                        if (Math.abs(curCol - epCol) === 1 && forwardRow === epRow) {
                            enPassantBox.style.backgroundColor = 'greenyellow';
                        }
                    }
                }
    
                // KING
    
                if (item.innerText == `${toggle}king`) {
    
    
                    if (aside < 8) {
                        document.getElementById(`b${a + 1}`).style.backgroundColor = 'greenyellow'
    
                    }
                    if (aside > 1) {
    
                        document.getElementById(`b${a - 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aup < 800) {
    
                        document.getElementById(`b${a + 100}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aup > 100) {
    
                        document.getElementById(`b${a - 100}`).style.backgroundColor = 'greenyellow'
                    }
    
                    if (aup > 100 && aside < 8) {
    
                        document.getElementById(`b${a - 100 + 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aup > 100 && aside > 1) {
    
                        document.getElementById(`b${a - 100 - 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aup < 800 && aside < 8) {
    
                        document.getElementById(`b${a + 100 + 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aup < 800 && aside > 1) {
    
                        document.getElementById(`b${a + 100 - 1}`).style.backgroundColor = 'greenyellow'
                    }
                    
                    const castlingTargets = getCastlingTargets(toggle); 
                    castlingTargets.forEach(id => {
                        document.getElementById(id).style.backgroundColor = 'greenyellow';
                    });
                    
                    item.style.backgroundColor = 'blue'
    
                }
    
                // KNIGHT
    
                if (item.innerText == `${toggle}knight`) {
    
    
                    if (aside < 7 && aup < 800) {
                        document.getElementById(`b${a + 100 + 2}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside < 7 && aup > 200) {
                        document.getElementById(`b${a - 100 + 2}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside < 8 && aup < 700) {
                        document.getElementById(`b${a + 200 + 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside > 1 && aup < 700) {
                        document.getElementById(`b${a + 200 - 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside > 2 && aup < 800) {
                        document.getElementById(`b${a - 2 + 100}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside > 2 && aup > 100) {
                        document.getElementById(`b${a - 2 - 100}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside < 8 && aup > 200) {
                        document.getElementById(`b${a - 200 + 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside > 1 && aup > 200) {
                        document.getElementById(`b${a - 200 - 1}`).style.backgroundColor = 'greenyellow'
                    }
    
                    item.style.backgroundColor = 'blue'
    
                }
    
                // QUEEN
    
                if (item.innerText == `${toggle}queen`) {
    
    
                    for (let i = 1; i < 9; i++) {
    
                        if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText == 0) {
                            document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                        }
                        else if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText !== 0) {
                            document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
                    for (let i = 1; i < 9; i++) {
    
                        if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText == 0) {
                            document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                        }
                        else if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText !== 0) {
                            document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
                    for (let i = 1; i < 9; i++) {
    
                        if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText == 0) {
                            document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText !== 0) {
                            document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
                    for (let i = 1; i < 9; i++) {
    
                        if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText == 0) {
                            document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText !== 0) {
                            document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
    
    
                    for (let i = 1; i < 9; i++) {
                        if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length == 0) {
                            document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length !== 0) {
                            document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
    
                    for (let i = 1; i < 9; i++) {
                        if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length == 0) {
                            document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length !== 0) {
                            document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
    
                    for (let i = 1; i < 9; i++) {
                        if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length == 0) {
                            document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length !== 0) {
                            document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
    
                    }
    
    
                    for (let i = 1; i < 9; i++) {
                        if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length == 0) {
                            document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length !== 0) {
                            document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
    
    
                    item.style.backgroundColor = 'blue'
    
                }
    
                // BISHOP
    
                if (item.innerText == `${toggle}bishop`) {
    
    
                    for (let i = 1; i < 9; i++) {
                        if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length == 0) {
                            document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length !== 0) {
                            document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
    
                    for (let i = 1; i < 9; i++) {
                        if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length == 0) {
                            document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length !== 0) {
                            document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
    
                    for (let i = 1; i < 9; i++) {
                        if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length == 0) {
                            document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length !== 0) {
                            document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
    
                    }
    
    
                    for (let i = 1; i < 9; i++) {
                        if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length == 0) {
                            document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length !== 0) {
                            document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
    
    
                    item.style.backgroundColor = 'blue'
    
                }
    
                // ROOK
    
                if (item.innerText == `${toggle}rook`) {
    
                    for (let i = 1; i < 9; i++) {
    
                        if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText == 0) {
                            document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                        }
                        else if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText !== 0) {
                            document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
                    for (let i = 1; i < 9; i++) {
    
                        if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText == 0) {
                            document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                        }
                        else if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText !== 0) {
                            document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
                    for (let i = 1; i < 9; i++) {
    
                        if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText == 0) {
                            document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText !== 0) {
                            document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
                    for (let i = 1; i < 9; i++) {
    
                        if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText == 0) {
                            document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                        }
                        else if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText !== 0) {
                            document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                            break
                        }
                    }
    
                    item.style.backgroundColor = 'blue'
                }
    
            }
    
            // Toggling the turn
    
            if (tog % 2 !== 0) {
                document.getElementById('tog').innerText = "White's Turn"
                whosTurn('W')
            }
            if (tog % 2 == 0) {
                document.getElementById('tog').innerText = "Black's Turn"
                whosTurn('B')
            }
    
            reddish();

            checkGameOver();
    
            if ((gameMode === "easy" || gameMode === "normal") && tog % 2 === 0) {
                setTimeout(() => {
                    if (gameMode === "easy") {
                        computerMoveEasy();
                    } else if (gameMode === "normal") {
                        computerMoveNormal();
                    }
                }, 50);
            }
    
        })
    })
}

// computerMove
function computerMoveEasy() {
    const allBoxes = Array.from(document.querySelectorAll('.box'));
    const blackPieces = allBoxes.filter(box => box.innerText.startsWith('B'));
    const possibleMoves = [];

    blackPieces.forEach(piece => {
        const backupTog = tog;
        piece.click();
        const greens = allBoxes.filter(b => b.style.backgroundColor === 'greenyellow');
        greens.forEach(target => {
            possibleMoves.push({
                from: piece.id,
                to: target.id,
                piece: piece.innerText
            });
        });
        coloring();
        insertImage();
        tog = backupTog;
    });

    if (possibleMoves.length === 0) return;

    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    document.getElementById(move.from).innerText = '';
    document.getElementById(move.to).innerText = move.piece;

    coloring();
    insertImage();
    reddish();
    tog++;
    document.getElementById("tog").innerText = "White's Turn";
    checkGameOver();
}

function computerMoveNormal() {
    const allBoxes = Array.from(document.querySelectorAll('.box'));
    const blackPieces = allBoxes.filter(box => box.innerText.startsWith('B'));
    const possibleMoves = [];

    blackPieces.forEach(piece => {
        const backupTog = tog;
        piece.click();
        const greens = allBoxes.filter(b => b.style.backgroundColor === 'greenyellow');
        greens.forEach(target => {
            possibleMoves.push({
                from: piece.id,
                to: target.id,
                piece: piece.innerText,
                isCapture: target.innerText.length > 0
            });
        });
        coloring();
        insertImage();
        tog = backupTog;
    });

    if (possibleMoves.length === 0) return;

    const captureMoves = possibleMoves.filter(m => m.isCapture);
    const move = (captureMoves.length > 0)
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    document.getElementById(move.from).innerText = '';
    document.getElementById(move.to).innerText = move.piece;

    coloring();
    insertImage();
    reddish();
    tog++;
    document.getElementById("tog").innerText = "White's Turn";
    checkGameOver();
}


// Moving the element
function bindBlueClick() {
    document.querySelectorAll('.box').forEach(hathiTest => {
    
        hathiTest.addEventListener('click', function () {
            
            if (gameOver) return;

            if (hathiTest.style.backgroundColor == 'blue') {
    
                blueId = hathiTest.id
                blueText = hathiTest.innerText
    
                document.querySelectorAll('.box').forEach(hathiTest2 => {
    
                    hathiTest2.addEventListener('click', function () {

                        if (hathiTest2.style.backgroundColor == 'greenyellow' && hathiTest2.innerText.length == 0) {

                            document.getElementById(blueId).innerText = ''

                            if (enPassantTarget && hathiTest2.id === enPassantTarget && blueText.endsWith('pawn')) {
                                const epCol = parseInt(hathiTest2.id[3]);
                                const epRow = parseInt(hathiTest2.id[2]);
                                const capturedRow = (tog % 2 !== 0) ? epRow - 1 : epRow + 1;
                                const capturedId = `b${capturedRow}${epCol}`;
                                document.getElementById(capturedId).innerText = ''; 
                            }

                            // Promotion
                            if (blueText.endsWith("pawn")) {
                                const row = parseInt(hathiTest2.id[2]);
                                if ((blueText.startsWith("W") && row === 8) || (blueText.startsWith("B") && row === 1)) {
                                    const color = blueText[0] === 'W' ? 'White' : 'Black';
                                    const choice = prompt(`${color} pawn reached the last rank!\nChoose promotion:\n1 = Queen\n2 = Rook\n3 = Bishop\n4 = Knight`);
                                    let promoted = blueText[0] + "queen";
                                    if (choice === "2") promoted = blueText[0] + "rook";
                                    else if (choice === "3") promoted = blueText[0] + "bishop";
                                    else if (choice === "4") promoted = blueText[0] + "knight";
                                    blueText = promoted;
                                }
                            }

                            // Castling
                            if ((blueText === 'Wking' && (hathiTest2.id === 'b107' || hathiTest2.id === 'b103')) ||
                                (blueText === 'Bking' && (hathiTest2.id === 'b807' || hathiTest2.id === 'b803'))) {
                                executeCastling(blueId, hathiTest2.id);
                            }

                            hathiTest2.innerText = blueText

                            if (blueText === 'Wking') whiteKingMoved = true;
                            if (blueText === 'Bking') blackKingMoved = true;
                            if (blueText === 'Wrook' && blueId === 'b101') whiteRookLeftMoved = true;
                            if (blueText === 'Wrook' && blueId === 'b108') whiteRookRightMoved = true;
                            if (blueText === 'Brook' && blueId === 'b801') blackRookLeftMoved = true;
                            if (blueText === 'Brook' && blueId === 'b808') blackRookRightMoved = true;

                            coloring()
                            insertImage()
                        }
                    })
                })
            }
        })
    })
}


// Prvents from selecting multiple elements

function bindColorResetClick() {
    document.querySelectorAll('.box').forEach(ee => {
        ee.addEventListener('click', function () {

            if (gameOver) return;

            z = z + 1
            if (z % 2 == 0 && ee.style.backgroundColor !== 'greenyellow') {
                coloring()
            }
        })
    })
}

function checkGameOver() {
    const allBoxes = Array.from(document.querySelectorAll('.box'));
    const whiteKingAlive = allBoxes.some(box => box.innerText.includes("Wking"));
    const blackKingAlive = allBoxes.some(box => box.innerText.includes("Bking"));

    const resultDiv = document.getElementById("game-result");

    if (!whiteKingAlive) {
        resultDiv.innerText = "Black wins!";
        resultDiv.style.display = "block";
        gameOver = true;
    } else if (!blackKingAlive) {
        resultDiv.innerText = "White wins!";
        resultDiv.style.display = "block";
        gameOver = true;
    }
}

function getCastlingTargets(piece, id) {
    const targets = [];

    if (piece === "Wking" && id === "b105" && !whiteKingMoved) {
        if (!whiteRookRightMoved &&
            document.getElementById("b106").innerText === '' &&
            document.getElementById("b107").innerText === '') {
            targets.push("b107");
        }
        if (!whiteRookLeftMoved &&
            document.getElementById("b102").innerText === '' &&
            document.getElementById("b103").innerText === '' &&
            document.getElementById("b104").innerText === '') {
            targets.push("b103");
        }
    }

    if (piece === "Bking" && id === "b805" && !blackKingMoved) {
        if (!blackRookRightMoved &&
            document.getElementById("b806").innerText === '' &&
            document.getElementById("b807").innerText === '') {
            targets.push("b807");
        }
        if (!blackRookLeftMoved &&
            document.getElementById("b802").innerText === '' &&
            document.getElementById("b803").innerText === '' &&
            document.getElementById("b804").innerText === '') {
            targets.push("b803");
        }
    }

    return targets;
}

function executeCastling(kingFrom, kingTo) {
    
    if (kingFrom === "b105" && kingTo === "b107") {
        document.getElementById("b108").innerText = '';
        document.getElementById("b106").innerText = 'Wrook';
    }
    
    if (kingFrom === "b105" && kingTo === "b103") {
        document.getElementById("b101").innerText = '';
        document.getElementById("b104").innerText = 'Wrook';
    }

    if (kingFrom === "b805" && kingTo === "b807") {
        document.getElementById("b808").innerText = '';
        document.getElementById("b806").innerText = 'Brook';
    }
    
    if (kingFrom === "b805" && kingTo === "b803") {
        document.getElementById("b801").innerText = '';
        document.getElementById("b804").innerText = 'Brook';
    }
}