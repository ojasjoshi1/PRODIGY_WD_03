const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('mode');

let cells = [];
let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let mode = 'human';

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function createBoard() {
  board.innerHTML = "";
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
    cells[i] = cell;
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (gameState[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);
  if (!gameActive) return;

  if (mode === 'ai' && currentPlayer === 'O') {
    setTimeout(() => {
      const bestMove = getBestMove();
      makeMove(bestMove, 'O');
    }, 300);
  }
}

function makeMove(index, player) {
  if (gameState[index] !== "") return;
  gameState[index] = player;
  cells[index].textContent = player;

  if (checkWinner(player)) {
    statusText.textContent = `${player === 'O' ? (mode === 'ai' ? "AI" : "Player O") : "Player X"} wins!`;
    gameActive = false;
  } else if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = player === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner(player) {
  return winningConditions.some(([a, b, c]) =>
    gameState[a] === player && gameState[b] === player && gameState[c] === player
  );
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = 'O';
      let score = minimax(gameState, 0, false);
      gameState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(state, depth, isMaximizing) {
  if (checkWinner('O')) return 10 - depth;
  if (checkWinner('X')) return depth - 10;
  if (!state.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = 'O';
        let score = minimax(state, depth + 1, false);
        state[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = 'X';
        let score = minimax(state, depth + 1, true);
        state[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

resetBtn.addEventListener('click', createBoard);
modeSelect.addEventListener('change', () => {
  mode = modeSelect.value;
  createBoard();
});

createBoard();
