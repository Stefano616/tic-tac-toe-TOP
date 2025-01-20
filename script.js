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
  const checkTie = () => {
    const availablePosition = board
      .map((row) => row.map((col) => col.getValue()))
      .flat()
      .includes(0);
    console.log(availablePosition);
    if (!availablePosition) return true;
    return false;
  };
  return { getBoard, markPosition, checkWin, checkTie };
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
  let infoMessage = "";
  const getInfoMessage = () => infoMessage;

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
      infoMessage = `${getActivePlayer().name} position not valid, you have to choose another position.`;
      return;
    }
    if (board.checkWin(getActivePlayer().mark)) {
      infoMessage = `${getActivePlayer().name} won the game!!!!!`;
      return;
    }
    if (board.checkTie()) {
      infoMessage = `It's a Tie!!!!!`;
      return;
    }
    switchPlayerTurn();
    infoMessage = `${getActivePlayer().name}'s turn...`;
  };
  infoMessage = `${getActivePlayer().name}'s turn...`;

  return {
    playRound,
    getBoard: board.getBoard,
    getInfoMessage,
  };
}

function ScreenController() {
  let game = "";
  const gameboard = document.querySelector(".gameboard");
  const displayPlayerInfo = document.querySelector(".player-info");
  const startBtn = document.querySelector(".start-btn");
  const playersNames = document.querySelectorAll(".player-input__input");

  const updateScreen = () => {
    gameboard.textContent = "";
    const board = game.getBoard();
    displayPlayerInfo.textContent = game.getInfoMessage();
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
  function clickHandlerStartBtn() {
    game = GameController(playersNames[0].value, playersNames[1].value);
    console.log(playersNames[0].value);
    playersNames.forEach((input) => input.setAttribute("disabled", ""));
    updateScreen();
    startBtn.textContent = "Restart";
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedColumn) return;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  startBtn.addEventListener("click", clickHandlerStartBtn);
  gameboard.addEventListener("click", clickHandlerBoard);
}

ScreenController();
