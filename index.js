
const GameBoard = function() {
    const board = [
        ["_", "_", "_"],
        ["_", "_", "_"],
        ["_", "_", "_"],
    ];
    const players = [
        { name: "Player 1", score: 0 },
        { name: "Player 2", score: 0 },
    ];


    const getBoard = () => board;

    const displayBoard = () => board.map(row => console.log(row));


    return { getBoard, displayBoard };
}();

const GameController = function() { };

GameBoard.displayBoard();
