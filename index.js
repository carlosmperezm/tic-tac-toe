
const GameBoard = function() {
    const board = [
        ["_", "_", "_"],
        ["_", "_", "_"],
        ["_", "_", "_"],
    ];

    const getBoard = () => board;

    const displayBoard = () => board.map(row => console.log(row));


    return { getBoard, displayBoard };
}();

const GameController = function() {

    const players = [
        { name: "Player 1", score: 0 },
        { name: "Player 2", score: 0 },
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;

    return { getActivePlayer, }
};




// GameBoard.displayBoard();
