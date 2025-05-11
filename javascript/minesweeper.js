document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const restartBtn = document.getElementById("restartButton");
  const mineCounter = document.getElementById("mineCounter");
  const victoryMessage = document.getElementById("victoryMessage");
  const radioButtons = document.querySelectorAll('input[name="difficulty"]');

radioButtons.forEach(radio => {
  radio.addEventListener("change", (e) => {
    setDifficulty(e.target.value);
  });
});


  let rows, cols, mineCount;
  let cells = [];

  const difficulties = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 20 },
    hard: { rows: 16, cols: 16, mines: 40 },
  };

  // Default difficulty
  setDifficulty("easy");

  // Handle restart
  restartButton.addEventListener("click", () => {
    createBoard();
  });

  // Handle difficulty buttons
  difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
      const level = button.dataset.difficulty;
      setDifficulty(level);
    });
  });

  function setDifficulty(level) {
    const config = difficulties[level];
    rows = config.rows;
    cols = config.cols;
    mineCount = config.mines;
    createBoard();
  }

  function createBoard() {
    board.innerHTML = "";
    cells = [];
    victoryMessage.style.display = "none";
    updateMineCounter(mineCount);

    board.style.display = "grid";
    board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    board.style.gap = "2px";
    board.style.margin = "20px auto";

    for (let i = 0; i < rows * cols; i++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.dataset.index = i;
      cellElement.addEventListener("click", handleLeftClick);
      cellElement.addEventListener("contextmenu", handleRightClick);
      board.appendChild(cellElement);

      cells.push({
        element: cellElement,
        mine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0,
      });
    }

    placeMines();
    calculateAdjacents();
  }

  function placeMines() {
    let placed = 0;
    while (placed < mineCount) {
      const index = Math.floor(Math.random() * cells.length);
      if (!cells[index].mine) {
        cells[index].mine = true;
        placed++;
      }
    }
  }

  function calculateAdjacents() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].mine) continue;
      const neighbors = getNeighbors(i);
      cells[i].adjacentMines = neighbors.filter(cell => cell.mine).length;
    }
  }

  function getNeighbors(index) {
    const neighbors = [];
    const x = index % cols;
    const y = Math.floor(index / cols);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          neighbors.push(cells[ny * cols + nx]);
        }
      }
    }
    return neighbors;
  }

  function handleLeftClick(e) {
    const index = parseInt(e.target.dataset.index);
    const cell = cells[index];
    if (cell.revealed || cell.flagged) return;

    if (cell.mine) {
      revealAll();
      cell.element.classList.add("mine");
      cell.element.textContent = "💣";
      alert("Game Over!");
      return;
    }

    revealCell(index);
    checkVictory();
  }

  function handleRightClick(e) {
    e.preventDefault();
    const index = parseInt(e.target.dataset.index);
    const cell = cells[index];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    cell.element.classList.toggle("flagged");
    cell.element.textContent = cell.flagged ? "🚩" : "";

    updateMineCounter(mineCount - cells.filter(c => c.flagged).length);
    checkVictory();
  }

  function revealCell(index) {
    const cell = cells[index];
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    cell.element.classList.add("revealed");

    if (cell.adjacentMines > 0) {
      cell.element.textContent = cell.adjacentMines;
      return;
    }

    const neighbors = getNeighbors(index);
    neighbors.forEach(neighbor => {
      revealCell(parseInt(neighbor.element.dataset.index));
    });
  }

  function revealAll() {
    for (const cell of cells) {
      cell.revealed = true;
      cell.element.classList.add("revealed");

      if (cell.mine) {
        cell.element.textContent = "💣";
        cell.element.classList.add("mine");
      } else if (cell.adjacentMines > 0) {
        cell.element.textContent = cell.adjacentMines;
      }
    }
  }

  function updateMineCounter(count) {
    mineCounter.textContent = `Mines Left: ${Math.max(count, 0)}`;
  }

  function checkVictory() {
    const allMinesFlagged = cells
      .filter(cell => cell.mine)
      .every(cell => cell.flagged);

    const allSafeRevealed = cells
      .filter(cell => !cell.mine)
      .every(cell => cell.revealed);

    if (allMinesFlagged && allSafeRevealed) {
      victoryMessage.style.display = "block";
      revealAll();
    }
  }
});
