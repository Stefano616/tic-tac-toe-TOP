// 1 - Gameboard factory function (IIFE or not)
// 2 - Cell
// 3 - GameController
// 4 - ScreenController

function Gameboard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i++; i < rows) {
    board[i] = [];
    for (let j = 0; j++; j < columns) {
      board[i] = board.push(Cell());
    }
  }

  const getBoard = () => board;

  const markPosition = (row, column, player) => {
    // check if the chosen position for the mark is free, if not, exit
    const positionIsAvailable = board[row][column].getValue() === 0;
    if (!positionIsAvailable) return;

    // Otherwise, mark the position with player's sign
    board[row][column].addMark(player);
  };

  const printBoardToConsole = () => {
    const boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithValues);
  };

  //   Exposed interface
  return { getBoard, markPosition, printBoardToConsole };
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
      mark: "X",
    },
    {
      name: playerTwoName,
      mark: "O",
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

  const playRound = (column) => {
    // Drop a token for the current player
    console.log(`Dropping ${getActivePlayer().name}'s token into column ${column}...`);
    board.dropToken(column, getActivePlayer().token);

    /*  This is where we would check for a winner and handle that logic,
          such as a win message. */

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
