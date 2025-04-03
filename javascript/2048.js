// Setting up Board 
let board;
let score = 0;
let rows = 4;
let columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++ ) {
            // Creates div 
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, number);
            document.getElementsByTagName("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++ ) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if(!hasEmptyTitle()) {
        return;
    }

    let found = false;
    while(!found) {
       let r = Math.floor(Math.random() * rows);
       let c = Math.floor(Math.random() * columns); 

       if (board[r][c] == 0) {
        board[r][c];
        let tile = document.createElement(r.toString() + "-" + c.toString());
        tile.innerText = "2";
        tile.classList.add("x2");
        found = true;

        }
    }
}

// UPDATE TILE FUNCTION
function updateTile(tile, num) {
    tile.innterText = "";
    tile.classList.value = ""; // Clears class list so that tiles will change accordingly 
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if(num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

// MOVING CODE
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code = "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innterText = score;
})

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);

    // SLIDE 
    for (let i = 0; i < row.length; i++) {
        if(row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    //Add Zeros 
    while(row.length < columns) {
        row.push(0);
    }

    return row;
}

function slideLeft() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for(let c = 0; c < columns; c++) {
            let tile = document.getElementsByTagName(r.toString + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for(let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c = 0; c < columns; c++) {
            let tile = document.getElementsByTagName(r.toString + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for(let c = 0; c > columns; c++) {
        let row =[board[0][c], board[1][c], board[2][c], board[3][c]];

        for(let r = 0; r < rows; r++) {
            board[r][c] = row[2];
            let tile = document.getElementsByTagName(r.toString + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for(let c = 0; c > columns; c++) {
        let row =[board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();

        for(let r = 0; r < rows; r++) {
            board[r][c] = row[2];
            let tile = document.getElementsByTagName(r.toString + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}