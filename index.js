




// Game 
const Game = function() {

  const getBoard = () => DOMController.getBoard();
  const getSpots = () => DOMController.getSpots();

  const updateBoard = (newSpots) => {
    getSpots().forEach((element) => element.remove());
    const board = document.querySelector('.board');
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
    const boardSpots = document.querySelectorAll('.board button');

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

  const isTie = () => {
    const spots = Game.getSpots();
    for (const spot of spots) {
      if (spot.textContent === '') return false;
    }
    return true;
  };

  const resetGame = () => {
    const spots = DOMController.createSpots();
    Game.updateBoard(spots);
  };

  return { getActivePlayer, switchPlayerTurn, changeSpotContent, isWinner, isTie, resetGame };

}();




function createPlayer(name, symbol) {

  const getName = () => name;
  const getSymbol = () => symbol;

  const playRound = (spotIndex) => {
    GameController.changeSpotContent(spotIndex, symbol);
  };

  return { getName, getSymbol, playRound };

}


const DOMController = function() {
  const board = document.createElement('div');
  const restartButton = document.createElement('button');
  const main = document.querySelector('main');

  board.classList.add('board');

  restartButton.classList.add('restart-button');



  const createInfoElement = () => {
    const infoContainer = document.createElement('div');
    const infoMessage = document.createElement('span');
    const restartButton = document.createElement('button');
    infoContainer.classList.add('info-container');
    infoMessage.classList.add('info-msg');
    restartButton.classList.add('restart-button');
    restartButton.textContent = 'Restart';

    infoContainer.appendChild(infoMessage);
    infoContainer.appendChild(restartButton);

    main.appendChild(infoContainer);

  };



  const deleteForm = () => form.remove();

  const getForm = () => document.querySelector('form');

  const getRestartButton = () => document.querySelector('.restart-button');

  const createBoard = () => {
    createInfoElement();
    createSpots().forEach((sport) => board.appendChild(sport));
    main.appendChild(board);
  };

  const getSubmitButton = () => form.querySelector('button.start-game');


  const getInputValue = (inputId) => {
    const input = document.querySelector(`#${inputId}`);
    return input.nodeValue;
  };

  const createSpots = () => {
    const buttonList = [];
    for (let i = 0; i < 9; i++) {
      const button = document.createElement('button');
      button.dataset.index = i;
      buttonList.push(button);

    }
    return buttonList;
  };


  const getSpots = () => board.querySelectorAll('.board button');

  const getBoard = () => board;

  const updateInfo = () => {
    const currentSymbol = GameController.getActivePlayer().getSymbol();
    const infoMsg = document.querySelector('.info-msg');
    infoMsg.textContent = `${currentSymbol} turn`;
  };

  const createMessage = (message) => {
    const messageBackground = document.createElement('div');
    messageBackground.classList.add('blur-background');

    const winnerMessage = document.createElement('div');
    winnerMessage.classList.add('winnerMessage');

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.classList.add('restart-button');

    const textMessage = document.createElement('span');
    textMessage.textContent = message;


    winnerMessage.appendChild(textMessage);
    winnerMessage.appendChild(restartButton);

    messageBackground.appendChild(winnerMessage);

    document.body.appendChild(messageBackground);

    restartButton.addEventListener('click', EventHandler.resetEventHandler);

  };



  return { getRestartButton, updateInfo, createMessage, getBoard, createSpots, getSpots, getForm, getInputValue, createBoard, deleteForm, getSubmitButton };

}();

const EventHandler = function() {

  const formEventHandler = (event) => {
    event.preventDefault();

    const player1Name = DOMController.getInputValue('player1-name');
    const player1Symbol = DOMController.getInputValue('player1-symbols');

    const player2Name = DOMController.getInputValue('player2-name');
    const player2Symbol = DOMController.getInputValue('player2-symbols');

    createPlayer(player1Name, player1Symbol);
    createPlayer(player2Name, player2Symbol);

    DOMController.deleteForm();
    DOMController.createBoard();


  };

  const resetEventHandler = (event) => {
    if (event.target.classList.contains('restart-button')) {
      const messageBackground = document.querySelector('.blur-background');
      GameController.resetGame();
      try {
        messageBackground.remove();

      } catch (e) {
        console.log('jeje');
      }

    }
  };

  const insertEventHandler = (event) => {
    const activePlayer = GameController.getActivePlayer();
    const buttonTarget = event.target;
    const buttonIndex = buttonTarget.dataset.index;

    try {
      activePlayer.playRound(buttonIndex);

      if (GameController.isWinner()) {
        const winMessage = `${GameController.getActivePlayer().getSymbol()} takes the round`;
        DOMController.createMessage(winMessage);
      }
      else if (GameController.isTie()) {
        const tieMessage = 'It\'s a tie';
        DOMController.createMessage(tieMessage);
      }

      GameController.switchPlayerTurn();
      DOMController.updateInfo();

    } catch (e) {
      console.log(e);
    }

  };

  return { insertEventHandler, resetEventHandler, formEventHandler };

}();



const form = DOMController.getForm();

form.addEventListener('submit', EventHandler.formEventHandler);


DOMController.getBoard().addEventListener('click', EventHandler.insertEventHandler);

document.body.addEventListener('click', EventHandler.resetEventHandler);
