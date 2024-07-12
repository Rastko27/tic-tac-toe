const gameboard = (function() {
    let spaces = [null, null, null, null, null, null, null, null, null];

    function refreshBoard() {
        for(let i=0; i<9; i++) {
            spaces[i] = null;
        }
    }

    return { spaces, refreshBoard };
})();

function createPlayer(name) {
    let score = 0, currentChoice, choices = [];

    function scoreUp() {
        score++;
    }

    function returnScore() {
        return score;
    }

    return { name, currentChoice, choices, scoreUp, returnScore };
}

const player1 = createPlayer("one");
const player2 = createPlayer("two");

const playDOM = (function() {
    let currentPlayer = player1;
    let gameboardClickCounter = 0;
    let gameboardWrapper = document.getElementById('gameboard-wrapper');

    function currentPlayerSwap() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    function getChoice(player) {
        if (gameboard.spaces[player.currentChoice] === null) {
            player.choices.push(player.currentChoice);
            gameboard.spaces[player.currentChoice] = player.name === player1.name ? "X" : "O";
        }
    }

    function checkResult() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        function checkWinningCombination(playerChoices) {
            return winningCombinations.some(combination =>
                combination.every(number => playerChoices.includes(number))
            );
        }

        let usedSpaces = gameboard.spaces.filter(space => space !== null).length;
        let player1Result = checkWinningCombination(player1.choices);
        let player2Result = checkWinningCombination(player2.choices);

        if (usedSpaces === 9) return "Draw";
        if (player1Result) return 1;
        if (player2Result) return 2;
        return 0;
    }

    function handleSpaceClick(spaceId) {
        if (gameboard.spaces[spaceId] === null) {
            currentPlayer.currentChoice = parseInt(spaceId);
            getChoice(currentPlayer);
            displayBoardDOM();

            let result = checkResult();
            if (result === "Draw") {
                alert("It's a draw!");
                gameboardWrapper.style.pointerEvents = "none";
            } else if (result === 1) {
                player1.scoreUp();
                alert("Player 1 wins!");
                gameboardWrapper.style.pointerEvents = "none";
            } else if (result === 2) {
                player2.scoreUp();
                alert("Player 2 wins!");
                gameboardWrapper.style.pointerEvents = "none";
            } else {
                currentPlayerSwap();
            }
        } else {
            alert("That space has already been marked, please choose another one.");
        }

        updateScoreboard();
    }

    function newGame() {
        player1.choices = [];
        player2.choices = [];
        gameboard.refreshBoard();
        currentPlayer = player1;
        gameboardWrapper.style.pointerEvents = "auto";
        displayBoardDOM();
    }

    let newGameButton = document.getElementById('new');

    newGameButton.addEventListener("click", newGame);

    function displayBoardDOM() {
        gameboardWrapper.innerHTML = "";

        for (let i = 0; i < 9; i++) {
            let currentSpace = document.createElement("div");
            currentSpace.textContent = gameboard.spaces[i] === null ? " " : gameboard.spaces[i];
            currentSpace.id = i;
            gameboardWrapper.appendChild(currentSpace);
            currentSpace.removeEventListener("click", handleSpaceClick)
            currentSpace.addEventListener("click", () => handleSpaceClick(currentSpace.id));
        }
    }

    function updateScoreboard() {
        const scoreboard = document.getElementById('scoreboard');
        scoreboard.textContent = `Score: Player 1 (${player1.returnScore()}) - Player 2 (${player2.returnScore()})`;
    }

    return { displayBoardDOM, updateScoreboard, newGame };
})();

playDOM.updateScoreboard();
playDOM.displayBoardDOM();
