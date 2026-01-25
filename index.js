// Game
var game = (function () {
    var getBoard = function () { return domController.getBoard(); };
    var getSpots = function () { return domController.getSpots(); };
    var updateBoard = function (newSpots) {
        getSpots().forEach(function (element) { return element.remove(); });
        var board = document.querySelector(".board");
        newSpots.forEach(function (element) { return board.appendChild(element); });
    };
    return { getBoard: getBoard, updateBoard: updateBoard, getSpots: getSpots };
})();
//Game Controller
var gameController = (function () {
    var players = [];
    var activePlayer;
    var addPlayers = function (player1, player2) {
        players.push(player1);
        players.push(player2);
        activePlayer = player1.getSymbol() === "X" ? player1 : player2;
        console.log(player1.getName());
    };
    var switchPlayerTurn = function () {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    var getActivePlayer = function () { return activePlayer; };
    var validateSpot = function (spotIndex) {
        var boardSpots = document.querySelectorAll(".board button");
        if (boardSpots[spotIndex].textContent === "X" ||
            boardSpots[spotIndex].textContent === "O") {
            return false;
        }
        return 0 <= spotIndex && spotIndex < 9;
    };
    var changeSpotContent = function (spotIndex, symbol) {
        if (!validateSpot(spotIndex)) {
            throw Error("Spot ".concat(spotIndex, " not valid"));
        }
        var newSpots = game.getSpots();
        newSpots[spotIndex].textContent = symbol;
        game.updateBoard(newSpots);
    };
    var isWinner = function () {
        var spots = game.getSpots();
        // Validating lines
        var options = {
            row1: [spots[0], spots[1], spots[2]],
            row2: [spots[3], spots[4], spots[5]],
            row3: [spots[6], spots[7], spots[8]],
            column1: [spots[0], spots[3], spots[6]],
            column2: [spots[1], spots[4], spots[7]],
            column3: [spots[6], spots[7], spots[8]],
            diagonal1: [spots[0], spots[4], spots[8]],
            diagonal2: [spots[2], spots[4], spots[6]],
        };
        for (var line in options) {
            if (options[line][0].textContent === activePlayer.getSymbol() &&
                options[line][1].textContent === activePlayer.getSymbol() &&
                options[line][2].textContent === activePlayer.getSymbol())
                return true;
        }
        return false;
    };
    var isTie = function () {
        var spots = game.getSpots();
        for (var i = 0; i < spots.length; i++) {
            var spot = spots[i];
            if (spot.textContent === "") {
                return false;
            }
        }
        return true;
    };
    var resetGame = function () {
        var spots = domController.createSpots();
        game.updateBoard(spots);
    };
    return {
        addPlayers: addPlayers,
        getActivePlayer: getActivePlayer,
        switchPlayerTurn: switchPlayerTurn,
        changeSpotContent: changeSpotContent,
        isWinner: isWinner,
        isTie: isTie,
        resetGame: resetGame,
    };
})();
function createPlayer(name, symbol) {
    var getName = function () { return name; };
    var getSymbol = function () { return symbol; };
    var playRound = function (spotIndex) {
        gameController.changeSpotContent(spotIndex, symbol);
    };
    return { getName: getName, getSymbol: getSymbol, playRound: playRound };
}
var domController = (function () {
    var board = document.createElement("div");
    var restartButton = document.createElement("button");
    var main = document.querySelector("main");
    board.classList.add("board");
    restartButton.classList.add("restart-button");
    var createInfoElement = function () {
        var infoContainer = document.createElement("div");
        var infoMessage = document.createElement("span");
        var restartButton = document.createElement("button");
        var quitButton = document.createElement("button");
        infoContainer.classList.add("info-container");
        infoMessage.classList.add("info-msg");
        restartButton.classList.add("restart-button");
        restartButton.textContent = "Restart";
        quitButton.classList.add("quit-button");
        quitButton.textContent = "Quit";
        var currentPlayer = gameController.getActivePlayer().getName();
        infoMessage.textContent = "".concat(currentPlayer, "'s turn");
        infoContainer.appendChild(quitButton);
        infoContainer.appendChild(infoMessage);
        infoContainer.appendChild(restartButton);
        main.appendChild(infoContainer);
    };
    var deleteForm = function () { return form.remove(); };
    var getForm = function () { return document.querySelector("form"); };
    var getRestartButton = function () {
        return document.querySelector(".restart-button");
    };
    var createBoard = function () {
        createInfoElement();
        createSpots().forEach(function (sport) {
            board.appendChild(sport);
        });
        main.appendChild(board);
    };
    var getSubmitButton = function () {
        return form.querySelector("button.start-game");
    };
    var getInputValue = function (inputId) {
        var input = document.querySelector("#".concat(inputId));
        return input.value;
    };
    var createSpots = function () {
        var buttonList = [];
        for (var i = 0; i < 9; i++) {
            var button = document.createElement("button");
            button.dataset.index = i.toString();
            buttonList.push(button);
        }
        return buttonList;
    };
    var getSpots = function () {
        var buttons = [];
        var buttonList = board.querySelectorAll(".board button");
        buttonList.forEach(function (buttonElement) {
            buttons.push(buttonElement);
        });
        return buttons;
    };
    var getBoard = function () { return board; };
    var updateInfo = function () {
        var currentPlayer = gameController.getActivePlayer().getName();
        var infoMsg = document.querySelector(".info-msg");
        infoMsg.textContent = "".concat(currentPlayer, "'s turn");
    };
    var createMessage = function (message, eventHandler) {
        var messageBackground = document.createElement("div");
        messageBackground.classList.add("blur-background");
        var winnerMessage = document.createElement("div");
        winnerMessage.classList.add("winnerMessage");
        var restartButton = document.createElement("button");
        restartButton.textContent = "Restart";
        restartButton.classList.add("restart-button");
        var textMessage = document.createElement("span");
        textMessage.textContent = message;
        winnerMessage.appendChild(textMessage);
        winnerMessage.appendChild(restartButton);
        messageBackground.appendChild(winnerMessage);
        document.body.appendChild(messageBackground);
        restartButton.addEventListener("click", eventHandler);
    };
    return {
        getRestartButton: getRestartButton,
        updateInfo: updateInfo,
        createMessage: createMessage,
        getBoard: getBoard,
        createSpots: createSpots,
        getSpots: getSpots,
        getForm: getForm,
        getInputValue: getInputValue,
        createBoard: createBoard,
        deleteForm: deleteForm,
        getSubmitButton: getSubmitButton,
    };
})();
var eventHandler = (function () {
    var formEventHandler = function (event) {
        event.preventDefault();
        var player1Name = domController.getInputValue("player1-name");
        var player1Symbol = domController.getInputValue("player1-symbols");
        var player2Name = domController.getInputValue("player2-name");
        var player2Symbol = domController.getInputValue("player2-symbols");
        var player1 = createPlayer(player1Name, player1Symbol);
        var player2 = createPlayer(player2Name, player2Symbol);
        if (player1Symbol === player2Symbol) {
            domController.createMessage("You have to choose different symbols", function () {
                return location.reload();
            });
            return;
        }
        gameController.addPlayers(player1, player2);
        domController.deleteForm();
        domController.createBoard();
    };
    var resetEventHandler = function (event) {
        if (!(event.target instanceof HTMLElement)) {
            throw new Error("Event's target could not be found");
        }
        if (event.target instanceof HTMLElement &&
            event.target.classList.contains("restart-button")) {
            var messageBackground = document.querySelector(".blur-background");
            gameController.resetGame();
            try {
                messageBackground.remove();
            }
            catch (e) {
                console.log("hah");
            }
        }
        else if (event.target.classList.contains("quit-button")) {
            location.reload();
        }
    };
    var insertEventHandler = function (event) {
        if (!(event.target instanceof HTMLElement)) {
            throw new Error("Event's target could not be found");
        }
        var activePlayer = gameController.getActivePlayer();
        var buttonTarget = event.target;
        var buttonIndex = parseInt(buttonTarget.dataset.index);
        try {
            activePlayer.playRound(buttonIndex);
            if (gameController.isWinner()) {
                var winMessage = "".concat(gameController.getActivePlayer().getName(), " takes the round");
                domController.createMessage(winMessage, eventHandler.resetEventHandler);
            }
            else if (gameController.isTie()) {
                var tieMessage = "It's a tie";
                domController.createMessage(tieMessage, eventHandler.resetEventHandler);
            }
            gameController.switchPlayerTurn();
            domController.updateInfo();
        }
        catch (e) {
            console.log(e);
        }
    };
    return { insertEventHandler: insertEventHandler, resetEventHandler: resetEventHandler, formEventHandler: formEventHandler };
})();
var form = domController.getForm();
form.addEventListener("submit", eventHandler.formEventHandler);
domController
    .getBoard()
    .addEventListener("click", eventHandler.insertEventHandler);
document.body.addEventListener("click", eventHandler.resetEventHandler);
