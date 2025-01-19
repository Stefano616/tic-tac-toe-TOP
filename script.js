function Gameboard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];

    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const markPosition = (row, column, player) => {
    const positionIsAvailable = board[row][column].getValue() === 0;

    if (!positionIsAvailable) {
      return false;
    }
    board[row][column].addMark(player);
    return true;
  };
  const checkWin = (player) => {
    const template = Array(3).fill(player, 0);
    const boardArr = board.map((row) => row.map((col) => col.getValue()));

    diagonal1 = boardArr.map((a, i) => a[i]);
    diagonal2 = boardArr.toReversed().map((a, i) => a[i]);
    transpose = boardArr[0].map((col, i) => boardArr.map((row) => row[i]));

    const matchRow = boardArr.filter((row) => row.toString() == template.toString());
    const matchCol = transpose.filter((row) => row.toString() == template.toString());
    const matchDiagonal =
      diagonal1.toString() == template.toString() ? true : diagonal2.toString() == template.toString();

    if (matchRow.length || matchCol.length || matchDiagonal) {
      return true;
    } else {
      return false;
    }
  };

  return { getBoard, markPosition, checkWin };
}

function Cell() {
  let cellValue = 0;
  const addMark = (player) => {
    cellValue = player;
  };
  const getValue = () => cellValue;

  return { addMark, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      mark: 1,
    },
    {
      name: playerTwoName,
      mark: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    if (!board.markPosition(row, column, getActivePlayer().mark)) {
      alert(`${getActivePlayer().name} position not valid, you have to choose another position.`);
      return;
    }

    if (board.checkWin(getActivePlayer().mark)) {
      return;
    }

    switchPlayerTurn();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    checkWin: board.checkWin,
  };
}

function ScreenController() {
  const game = GameController();
  const gameboard = document.querySelector(".gameboard");
  const displayPlayerInfo = document.querySelector(".player-info");

  const updateScreen = () => {
    gameboard.textContent = "";

    const board = game.getBoard();
    const { name: activePlayerName, mark: activePlayerMark } = game.getActivePlayer();

    if (game.checkWin(activePlayerMark)) {
      displayPlayerInfo.textContent = `${activePlayerName} won the game!!!!!`;
      return;
    }

    displayPlayerInfo.textContent = `${activePlayerName}'s turn...`;

    board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("gameboard__cell");
        cellButton.dataset.row = rowIdx;
        cellButton.dataset.column = colIdx;
        cellButton.textContent = cell.getValue() == 1 ? "X" : cell.getValue() == 2 ? "O" : " ";
        gameboard.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  gameboard.addEventListener("click", clickHandlerBoard);
  updateScreen();
}

ScreenController();
