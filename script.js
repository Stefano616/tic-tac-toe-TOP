// 1 - Gameboard factory function (IIFE or not)
// 2 - Cell
// 3 - GameController
// 4 - ScreenController

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
    // check if the chosen position for the mark is free, if not, return false

    const positionIsAvailable = board[row][column].getValue() === 0;

    if (!positionIsAvailable) {
      return false;
    }
    // Otherwise, mark the position with player's sign
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

  const printBoardToConsole = () => {
    const boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithValues);
  };

  //   Exposed interface
  return { getBoard, markPosition, checkWin, printBoardToConsole };
}

function Cell() {
  let cellValue = 0;
  const addMark = (player) => {
    cellValue = player;
  };
  const getValue = () => cellValue;

  return { addMark, getValue };
}

/*
 ** The GameController will be responsible for controlling the
 ** flow and state of the game's turns, as well as whether
 ** anybody has won the game
 */
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

  const printNewRound = () => {
    board.printBoardToConsole();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    // Add mark for the current player
    console.log(`Adding ${getActivePlayer().name}'s mark into position (${row}, ${column})...`);

    // If the chosen position is not valid, the current player can attempt again to put its mark.
    if (!board.markPosition(row, column, getActivePlayer().mark)) {
      console.log(`${getActivePlayer().name} position not valid, you have to choose another position.`);
      printNewRound();
      return;
    }
    /*  This is where we would check for a winner and handle that logic,
          such as a win message. */
    if (board.checkWin(getActivePlayer().mark)) {
      console.log(`${getActivePlayer().name} won the game!!!!!`);
      return;
    }

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
