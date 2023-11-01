const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const winnerGifContainer = document.getElementById('winnerGifContainer');
const friendBtn = document.getElementById("friendBtn");
const computerBtn = document.getElementById("computerBtn");
const clickSound = document.getElementById("clickSound");
const restartSound = document.getElementById("restartSound");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let vsComputer = false;

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute("data-cell-index");

    if (gameBoard[cellIndex] !== "" || !gameActive) return;

    gameBoard[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
    clickSound.play();

    if (checkWin()) {
        handleGameEnd();
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `${currentPlayer}'s turn`;

        if (vsComputer && currentPlayer === "O" && gameActive) {
            setTimeout(makeComputerMove, 500);
        }
    }
}

function makeComputerMove() {
    if (!gameActive) return;

    let emptyCells = gameBoard.reduce((acc, val, index) => {
        if (val === "") {
            acc.push(index);
        }
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameBoard[randomIndex] = "O";
        cells[randomIndex].textContent = "O";
        cells[randomIndex].classList.add("O");

        if (checkWin()) {
            handleGameEnd();
        } else {
            currentPlayer = "X";
            status.textContent = `${currentPlayer}'s turn`;
        }
    }
}

function checkWin() {
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombination) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            cells[a].classList.add('win', 'cellAnimation');
            cells[b].classList.add('win', 'cellAnimation');
            cells[c].classList.add('win', 'cellAnimation');
            return true;
        }
    }

    return false;
}

function handleGameEnd() {
    gameActive = false;
    winnerGifContainer.style.display = 'block';
    status.textContent = `${currentPlayer} wins!`;
}

function restartGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    status.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O", "win", "cellAnimation"); // Remove cellAnimation class
    });
    winnerGifContainer.style.display = 'none';
    restartSound.play();
}


function setGameMode(mode) {
    vsComputer = mode === "computer";
    restartGame();
    if (vsComputer && currentPlayer === "O") {
        setTimeout(makeComputerMove, 500);
    }
}

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

restartBtn.addEventListener("click", restartGame);
friendBtn.addEventListener("click", () => setGameMode("friend"));
computerBtn.addEventListener("click", () => setGameMode("computer"));
