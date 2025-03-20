
const board = document.querySelector('.board');




// Game 
const Game = function() {

  const getBoard = () => document.querySelector('.board');
  const getSpots = () => getBoard().querySelectorAll('button');

  const updateBoard = (newSpots) => {
    getSpots().forEach((element) => element.remove());
    newSpots.forEach((element) => board.appendChild(element));
  };

  return { getBoard, updateBoard, getSpots };

}();



//Game Controller
const GameController = function() {

  const players = [
    createPlayer('player1', 'X'),
    createPlayer('player2', 'O'),
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

  const getActivePlayer = () => activePlayer;


  const validateSpot = (spotIndex) => {
    // const boardSpots = Game.getSpots();
    const boardSpots = document.querySelectorAll('.board button');
    console.log(boardSpots[spotIndex]);


    if (boardSpots[spotIndex].textContent === 'X' || boardSpots[spotIndex].textContent === 'O')
      return false;
    return 0 < spotIndex < 10;
  };

  const changeSpotContent = (spotIndex, symbol) => {

    if (!validateSpot(spotIndex)) throw Error(`Spot ${spotIndex} not valid`);

    const newSpots = Game.getSpots();

    newSpots[spotIndex].textContent = symbol;

    Game.updateBoard(newSpots);

  };

  const isWinner = () => {
    const spots = Game.getSpots();

    // Validating lines
    const options = {
      row1: [spots[0], spots[1], spots[2]],
      row2: [spots[3], spots[4], spots[5]],
      row3: [spots[6], spots[7], spots[8]],
      column1: [spots[0], spots[3], spots[6]],
      column2: [spots[1], spots[4], spots[7]],
      column3: [spots[6], spots[7], spots[8]],
      diagonal1: [spots[0], spots[4], spots[8]],
      diagonal2: [spots[2], spots[4], spots[6]],
    };

    for (const line in options) {

      if (options[line][0].textContent === activePlayer.getSymbol() &&
        options[line][1].textContent === activePlayer.getSymbol() &&
        options[line][2].textContent === activePlayer.getSymbol())
        return true;
    }
    return false;
  };

  const resetGame = () => {
    const spots = [];

    for (let i = 0; i < 9; i++) {
      const button = document.createElement('button');
      button.dataset.index = i;
      spots.push(button);
    }
    Game.updateBoard(spots);
  };

  return { getActivePlayer, switchPlayerTurn, changeSpotContent, isWinner, resetGame };

}();




function createPlayer(name, symbol) {

  const getName = () => name;
  const getSymbol = () => symbol;

  const playRound = (spotIndex) => {
    GameController.changeSpotContent(spotIndex, symbol);
  };

  return { getName, getSymbol, playRound };

}




function insertEventHandler(event) {
  const activePlayer = GameController.getActivePlayer();
  const buttonTarget = event.target;
  const buttonIndex = buttonTarget.dataset.index;

  try {
    activePlayer.playRound(buttonIndex);

    if (GameController.isWinner()) {
      createWinnerMessage();

    }

    GameController.switchPlayerTurn();
    UpdateInfo();

  } catch (e) {
    console.log(e);
  }


}



board.addEventListener('click', insertEventHandler);


function UpdateInfo() {
  const currentSymbol = GameController.getActivePlayer().getSymbol();
  const infoMsg = document.querySelector('.info-msg');
  infoMsg.textContent = `${currentSymbol} turn`;
}



function resetEventHandler(event) {
  const messageBackground = document.querySelector('.blur-background');
  GameController.resetGame();
  messageBackground.remove();


}


function createWinnerMessage() {
  const messageBackground = document.createElement('div');
  messageBackground.classList.add('blur-background');

  const winnerMessage = document.createElement('div');
  winnerMessage.classList.add('winnerMessage');

  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart';
  restartButton.classList.add('restart-button');

  const textMessage = document.createElement('span');
  textMessage.textContent = `${GameController.getActivePlayer().getSymbol()} takes the round`;


  winnerMessage.appendChild(textMessage);
  winnerMessage.appendChild(restartButton);

  messageBackground.appendChild(winnerMessage);

  document.body.appendChild(messageBackground);

  restartButton.addEventListener('click', resetEventHandler);

}

UpdateInfo();

const restartButton = document.querySelector('.restart-button');
restartButton.addEventListener('click', resetEventHandler);
