
const Game = function() {
  let board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
  ];

  const getBoard = () => board;

  const displayBoard = () => board.map((row) => console.log(row));

  const updateBoard = (newBoard) => board = newBoard;


  return { getBoard, displayBoard, updateBoard };
}();


const GameController = function() {

  const players = [
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

  const getActivePlayer = () => activePlayer;

  const getSpotIndexes = (spot) => {
    let row = 0;
    let column = spot - 1;

    if (4 <= spot && spot <= 6) {
      row = 1;
      column = spot - 4;
    }
    else if (7 <= spot && spot <= 10) {
      row = 2;
      column = spot - 7;
    }
    return { row, column };

  };

  const validateSpot = (spot) => {
    const row = getSpotIndexes(spot).row;
    const column = getSpotIndexes(spot).column;
    const board = Game.getBoard();

    if (board[row][column] === 'X' || board[row][column] === 'O')
      return false;
    return 0 < spot < 10;
  };

  const playRound = (spot, symbol) => {

    if (!validateSpot(spot)) return console.log(`Spot ${spot} not valid`);

    const newBoard = Game.getBoard();

    if (4 <= spot && spot <= 6) {
      newBoard[1][spot - 4] = symbol;
    }
    else if (7 <= spot && spot <= 10) {
      newBoard[2][spot - 7] = symbol;
    }
    else if (1 <= spot && spot <= 3) {
      newBoard[0][spot - 1] = symbol;
    }

    Game.updateBoard(newBoard);

  };


  return { getActivePlayer, playRound };

}();


function createPlayer(name, symbol) {

  const getName = () => name;
  const getSymbol = () => symbol;

  const playRound = (spot) => {
    GameController.playRound(spot, symbol);
  };

  return { getName, getSymbol, playRound };

}


Game.displayBoard();

const player1 = createPlayer('player1', 'X');

let position = 4;
console.info(`${player1.getName()} has chosen X in the position ${position}`);
player1.playRound(position);


Game.displayBoard();

const player2 = createPlayer('player2', 'O');

position = 9;
console.info(`${player2.getName()} has chosen O in the position ${position}`);
player2.playRound(position);
Game.displayBoard();

position = 3;
console.info(`${player1.getName()} has chosen X in the position ${position}`);
player1.playRound(position);
Game.displayBoard();

position = 3;
console.info(`${player2.getName()} has chosen O in the position ${position}`);
player2.playRound(position);
Game.displayBoard();
