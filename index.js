
const board = document.querySelector('.board');




// Game 
const Game = function(board) {
  const spots = board.querySelectorAll('button');

  const getBoard = () => board;
  const getSpots = () => spots;

  const updateBoard = (newSpots) => {
    spots.forEach((element) => element.remove());
    newSpots.forEach((element) => board.appendChild(element));
  };

  return { getBoard, updateBoard, getSpots };

}(board);



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
    const boardSpots = Game.getSpots();


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

  return { getActivePlayer, switchPlayerTurn, changeSpotContent, isWinner };

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

      const messageBackground = document.createElement('div');
      messageBackground.classList.add('blur-background');

      const winnerMessage = document.createElement('div');
      winnerMessage.textContent = `${activePlayer.getName()} has won`;
      winnerMessage.classList.add('winnerMessage');

      messageBackground.appendChild(winnerMessage);
      document.body.appendChild(messageBackground);
    }

    GameController.switchPlayerTurn();

  } catch (e) {
    alert('Choose another spot');
  }


}



board.addEventListener('click', insertEventHandler);




