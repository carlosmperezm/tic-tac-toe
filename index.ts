interface DOMController {
  getRestartButton: () => HTMLButtonElement;
  updateInfo: () => void;
  createMessage: (message: string, eventHandler: EventListener) => void;
  getBoard: () => HTMLElement;
  createSpots: () => HTMLButtonElement[];
  getSpots: () => HTMLButtonElement[];
  getForm: () => HTMLFormElement;
  getInputValue: (inputId: string) => string;
  createBoard: () => void;
  deleteForm: () => void;
  getSubmitButton: () => void;
}
interface Game {
  getBoard: () => HTMLElement;
  getSpots: () => HTMLButtonElement[];
  updateBoard: (newSpots: HTMLButtonElement[]) => void;
}
interface GameController {
  addPlayers: (player1: Player, player2: Player) => void;
  getActivePlayer: () => Player;
  switchPlayerTurn: () => void;
  changeSpotContent: (spotIndex: number, symbol: string) => void;
  isWinner: () => boolean;
  isTie: () => boolean;
  resetGame: () => void;
}
interface Player {
  getName: () => string;
  getSymbol: () => string;
  playRound: (spotIndex: number) => void;
}
interface Options {
  row1: HTMLButtonElement[];
  row2: HTMLButtonElement[];
  row3: HTMLButtonElement[];
  column1: HTMLButtonElement[];
  column2: HTMLButtonElement[];
  column3: HTMLButtonElement[];
  diagonal1: HTMLButtonElement[];
  diagonal2: HTMLButtonElement[];
}
interface EventHandler {
  insertEventHandler: EventListener;
  resetEventHandler: EventListener;
  formEventHandler: EventListener;
}

// Game
const game: Game = (function (): Game {
  const getBoard = (): HTMLElement => domController.getBoard();
  const getSpots = (): HTMLButtonElement[] => domController.getSpots();

  const updateBoard = (newSpots: HTMLButtonElement[]): void => {
    getSpots().forEach((element) => element.remove());
    const board = document.querySelector(".board");
    newSpots.forEach((element) => board.appendChild(element));
  };

  return { getBoard, updateBoard, getSpots };
})();

//Game Controller
const gameController: GameController = (function () {
  const players: Player[] = [];

  let activePlayer: Player;

  const addPlayers = (player1: Player, player2: Player): void => {
    players.push(player1);
    players.push(player2);

    activePlayer = player1.getSymbol() === "X" ? player1 : player2;

    console.log(player1.getName());
  };

  const switchPlayerTurn = (): void => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const validateSpot = (spotIndex: number): boolean => {
    const boardSpots: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll(".board button");

    if (
      boardSpots[spotIndex].textContent === "X" ||
      boardSpots[spotIndex].textContent === "O"
    ) {
      return false;
    }

    return 0 <= spotIndex && spotIndex < 9;
  };

  const changeSpotContent = (spotIndex: number, symbol: string): void => {
    if (!validateSpot(spotIndex)) {
      throw Error(`Spot ${spotIndex} not valid`);
    }
    const newSpots: HTMLButtonElement[] = game.getSpots();
    newSpots[spotIndex].textContent = symbol;
    game.updateBoard(newSpots);
  };

  const isWinner = (): boolean => {
    const spots = game.getSpots();

    // Validating lines
    const options: Options = {
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
      if (
        options[line][0].textContent === activePlayer.getSymbol() &&
        options[line][1].textContent === activePlayer.getSymbol() &&
        options[line][2].textContent === activePlayer.getSymbol()
      )
        return true;
    }
    return false;
  };

  const isTie = (): boolean => {
    const spots: HTMLButtonElement[] = game.getSpots();

    for (let i = 0; i < spots.length; i++) {
      const spot: HTMLButtonElement = spots[i];
      if (spot.textContent === "") {
        return false;
      }
    }
    return true;
  };

  const resetGame = (): void => {
    const spots: HTMLButtonElement[] = domController.createSpots();
    game.updateBoard(spots);
  };

  return {
    addPlayers,
    getActivePlayer,
    switchPlayerTurn,
    changeSpotContent,
    isWinner,
    isTie,
    resetGame,
  };
})();

function createPlayer(name: string, symbol: string): Player {
  const getName = (): string => name;
  const getSymbol = (): string => symbol;

  const playRound = (spotIndex: number): void => {
    gameController.changeSpotContent(spotIndex, symbol);
  };

  return { getName, getSymbol, playRound };
}

const domController: DOMController = (function (): DOMController {
  const board: HTMLDivElement = document.createElement("div");
  const restartButton: HTMLButtonElement = document.createElement("button");
  const main: HTMLElement = document.querySelector("main");

  board.classList.add("board");

  restartButton.classList.add("restart-button");

  const createInfoElement = (): void => {
    const infoContainer: HTMLDivElement = document.createElement("div");
    const infoMessage: HTMLSpanElement = document.createElement("span");
    const restartButton: HTMLButtonElement = document.createElement("button");
    const quitButton: HTMLButtonElement = document.createElement("button");

    infoContainer.classList.add("info-container");
    infoMessage.classList.add("info-msg");
    restartButton.classList.add("restart-button");
    restartButton.textContent = "Restart";
    quitButton.classList.add("quit-button");
    quitButton.textContent = "Quit";

    const currentPlayer: string = gameController.getActivePlayer().getName();
    infoMessage.textContent = `${currentPlayer}'s turn`;

    infoContainer.appendChild(quitButton);
    infoContainer.appendChild(infoMessage);
    infoContainer.appendChild(restartButton);

    main.appendChild(infoContainer);
  };

  const deleteForm = (): void => form.remove();

  const getForm = (): HTMLFormElement => document.querySelector("form");

  const getRestartButton = (): HTMLButtonElement =>
    document.querySelector(".restart-button");

  const createBoard = (): void => {
    createInfoElement();
    createSpots().forEach((sport): void => {
      board.appendChild(sport);
    });
    main.appendChild(board);
  };

  const getSubmitButton = (): HTMLButtonElement =>
    form.querySelector("button.start-game");

  const getInputValue = (inputId: string): string => {
    const input: HTMLInputElement = document.querySelector(`#${inputId}`);
    return input.value;
  };

  const createSpots = (): Array<HTMLButtonElement> => {
    const buttonList: HTMLButtonElement[] = [];
    for (let i: number = 0; i < 9; i++) {
      const button: HTMLButtonElement = document.createElement("button");
      button.dataset.index = i.toString();
      buttonList.push(button);
    }
    return buttonList;
  };

  const getSpots = (): HTMLButtonElement[] => {
    const buttons: HTMLButtonElement[] = [];
    const buttonList: NodeListOf<HTMLButtonElement> =
      board.querySelectorAll(".board button");
    buttonList.forEach((buttonElement) => {
      buttons.push(buttonElement);
    });
    return buttons;
  };
  const getBoard = (): HTMLDivElement => board;

  const updateInfo = (): void => {
    const currentPlayer: string = gameController.getActivePlayer().getName();
    const infoMsg: HTMLElement = document.querySelector(".info-msg");
    infoMsg.textContent = `${currentPlayer}'s turn`;
  };

  const createMessage = (
    message: string,
    eventHandler: EventListener,
  ): void => {
    const messageBackground: HTMLDivElement = document.createElement("div");
    messageBackground.classList.add("blur-background");

    const winnerMessage: HTMLDivElement = document.createElement("div");
    winnerMessage.classList.add("winnerMessage");

    const restartButton: HTMLButtonElement = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.classList.add("restart-button");

    const textMessage: HTMLSpanElement = document.createElement("span");
    textMessage.textContent = message;

    winnerMessage.appendChild(textMessage);
    winnerMessage.appendChild(restartButton);

    messageBackground.appendChild(winnerMessage);

    document.body.appendChild(messageBackground);

    restartButton.addEventListener("click", eventHandler);
  };

  return {
    getRestartButton,
    updateInfo,
    createMessage,
    getBoard,
    createSpots,
    getSpots,
    getForm,
    getInputValue,
    createBoard,
    deleteForm,
    getSubmitButton,
  };
})();

const eventHandler: EventHandler = (function (): EventHandler {
  const formEventHandler = (event: Event): void => {
    event.preventDefault();

    const player1Name: string = domController.getInputValue("player1-name");
    const player1Symbol: string =
      domController.getInputValue("player1-symbols");

    const player2Name: string = domController.getInputValue("player2-name");
    const player2Symbol: string =
      domController.getInputValue("player2-symbols");

    const player1: Player = createPlayer(player1Name, player1Symbol);
    const player2: Player = createPlayer(player2Name, player2Symbol);

    if (player1Symbol === player2Symbol) {
      domController.createMessage("You have to choose different symbols", () =>
        location.reload(),
      );
      return;
    }

    gameController.addPlayers(player1, player2);

    domController.deleteForm();
    domController.createBoard();
  };

  const resetEventHandler = (event: Event): void => {
    if (!(event.target instanceof HTMLElement)) {
      throw new Error("Event's target could not be found");
    }
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains("restart-button")
    ) {
      const messageBackground: HTMLElement =
        document.querySelector(".blur-background");
      gameController.resetGame();

      try {
        messageBackground.remove();
      } catch (e) {
        console.log("hah");
      }
    } else if (event.target.classList.contains("quit-button")) {
      location.reload();
    }
  };

  const insertEventHandler = (event: Event): void => {
    if (!(event.target instanceof HTMLElement)) {
      throw new Error("Event's target could not be found");
    }

    const activePlayer: Player = gameController.getActivePlayer();
    const buttonTarget: HTMLElement = event.target;
    const buttonIndex: number = parseInt(buttonTarget.dataset.index);

    try {
      activePlayer.playRound(buttonIndex);

      if (gameController.isWinner()) {
        const winMessage: string = `${gameController.getActivePlayer().getName()} takes the round`;
        domController.createMessage(winMessage, eventHandler.resetEventHandler);
      } else if (gameController.isTie()) {
        const tieMessage: string = "It's a tie";
        domController.createMessage(tieMessage, eventHandler.resetEventHandler);
      }

      gameController.switchPlayerTurn();
      domController.updateInfo();
    } catch (e) {
      console.log(e);
    }
  };

  return { insertEventHandler, resetEventHandler, formEventHandler };
})();

const form: HTMLFormElement = domController.getForm();

form.addEventListener("submit", eventHandler.formEventHandler);

domController
  .getBoard()
  .addEventListener("click", eventHandler.insertEventHandler);

document.body.addEventListener("click", eventHandler.resetEventHandler);
