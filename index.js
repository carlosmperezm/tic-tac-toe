
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

  const validateSpot = (spot) => 0 < spot < 10;

  const playRound = (spot, symbol) => {
    if (!validateSpot(spot)) return `Spot ${spot} not valid`;


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
player1.playRound(4);

console.info(`${player1.getName()} has chosen`);

Game.displayBoard();

const player2 = createPlayer('player2', 'O');
player2.playRound(9);
console.info(`${player2.getName()} has chosen`);
Game.displayBoard();

player1.playRound(3);
console.info(`${player1.getName()} has chosen`);
Game.displayBoard();

player2.playRound(2);
console.info(`${player2.getName()} has chosen`);
Game.displayBoard();

//TODO: Not allow override a taken spot
