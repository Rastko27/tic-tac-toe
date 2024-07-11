const gameboard = (function() {
    let spaces = [null,null,null,null,null,null,null,null,null];
    
    function displayBoardStart() {
        console.log("[0] [1] [2]\n[3] [4] [5]\n[6] [7] [8]");
    }

    function displayCurrentBoard() {
        console.log("[" + gameboard.spaces[0] + "] [" + gameboard.spaces[1] + "] [" + gameboard.spaces[2] + "]\n[" + gameboard.spaces[3] + "] [" + gameboard.spaces[4] + "] [" + gameboard.spaces[5] + "]\n[" + gameboard.spaces[6] + "] [" + gameboard.spaces[7] + "] [" + gameboard.spaces[8] + "]");
    }

    function refreshBoard() {
        spaces = [null,null,null,null,null,null,null,null,null];
    }

    return{ spaces, displayBoardStart, displayCurrentBoard, refreshBoard };
})();

function createPlayer(name) {
    let score = 0, currentChoice, choices = [];

    function scoreUp() {
        score++;
    }

    function returnScore() {
        return score;
    }

    function resetChoices() {
        choices = [];
    }

    return { name, currentChoice, choices, scoreUp, returnScore, resetChoices };
}

const player1 = createPlayer("one");
const player2 = createPlayer("two");

const playGame = (function() {

    function getChoice(player) {
        player.currentChoice = parseInt(prompt("Player " + player.name + " pick:"));
        if(gameboard.spaces[player.currentChoice] === null) {
            player.choices.push(player.currentChoice);

            if(player.name === "one") {
                gameboard.spaces[player.currentChoice] = "X";
            }
            else if(player.name === "two") {
                gameboard.spaces[player.currentChoice] = "O";
            }
        }
        else{
            console.log("That space has already been marked, please choose another one.");
            getChoice(player);
        }
    }

    function checkResult() {
        const winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Top-left to bottom-right diagonal
            [2, 4, 6]  // Top-right to bottom-left diagonal
        ]

        function checkWinningCombination(playerChoices, winningCombinations) {
            return winningCombinations.some((combination) => combination.every((number) => 
                playerChoices.includes(number)));
        }

        let usedSpaces = 0;

        for(let i=0; i<9; i++) {
            if(gameboard.spaces[i] !== null) {
                usedSpaces++;
            }
        }

        let sortedPlayer1Choices = player1.choices.slice().sort((a, b) => a - b);
        let sortedPlayer2Choices = player2.choices.slice().sort((a, b) => a - b);

        let player1Result = checkWinningCombination(sortedPlayer1Choices, winningCombinations);
        let player2Result = checkWinningCombination(sortedPlayer2Choices, winningCombinations);

        if(usedSpaces === 9) {
            return "Draw";
        }
        else if(player1Result === true) {
            return 1;
        }
        else if(player2Result === true) {
            return 2;
        }
        else {
            return 0;
        }
    }

    function play() {
        player1.resetChoices();
        player2.resetChoices();
        gameboard.refreshBoard();
        gameboard.displayBoardStart();
        
        while(true) {
            getChoice(player1);
            gameboard.displayCurrentBoard();
            if(checkResult() !== 0) break;

            getChoice(player2);
            gameboard.displayCurrentBoard();
            if(checkResult() !== 0) break;
        }

        let result = checkResult();

        if(result === "Draw") {
            console.log("It's a draw!");
        }
        else if(result === 1) {
            console.log("Player 1 wins!");
            player1.scoreUp();
        }
        else if(result === 2) {
            console.log("Player 2 wins!");
            player2.scoreUp();
        }
        console.log("Score: " + player1.returnScore() + ":" + player2.returnScore());
    }

    return{ play };
})();