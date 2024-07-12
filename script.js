const gameboard = (function() {
    let spaces = [null, null, null, null, null, null, null, null, null];

    function refreshBoard() {
        spaces = [null, null, null, null, null, null, null, null, null];
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

    function resetChoices() {
        choices = [];
    }

    return { name, currentChoice, choices, scoreUp, returnScore, resetChoices };
}

const player1 = createPlayer("one");
const player2 = createPlayer("two");

const playDOM = (function() {
    let currentPlayer;
    let gameboardClickCounter = 0;
    let gameboardWrapper = document.getElementById('gameboard-wrapper');

    function currentPlayerSwap() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    function getChoice(player) {
        if (gameboard.spaces[player.currentChoice] === null) {
            player.choices.push(player.currentChoice);
            gameboard.spaces[player.currentChoice] = player.name === "one" ? "X" : "O";
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
        if (gameboardClickCounter > 0 && (checkResult() === 1 || checkResult() === 2 || checkResult() === "Draw")) {
            resetGame();
            displayBoardDOM();
            return;
        }

        if (gameboardClickCounter === 0) {
            resetGame();
            displayBoardDOM();
            currentPlayer = player1;
        }

        gameboardClickCounter++;

        if (gameboard.spaces[spaceId] === null) {
            currentPlayer.currentChoice = parseInt(spaceId);
            getChoice(currentPlayer);
            displayBoardDOM();

            let result = checkResult();
            if (result === "Draw") {
                alert("It's a draw!");
            } else if (result === 1) {
                player1.scoreUp();
                alert("Player 1 wins!");
            } else if (result === 2) {
                player2.scoreUp();
                alert("Player 2 wins!");
            } else {
                currentPlayerSwap();
            }
        } else {
            alert("That space has already been marked, please choose another one.");
        }

        updateScoreboard();
    }

    function resetGame() {
        player1.resetChoices();
        player2.resetChoices();
        gameboard.refreshBoard();
        gameboardClickCounter = 0;
        currentPlayer = player1;
    }

    function displayBoardDOM() {
        gameboardWrapper.innerHTML = "";

        for (let i = 0; i < 9; i++) {
            let currentSpace = document.createElement("div");
            currentSpace.textContent = gameboard.spaces[i] === null ? " " : gameboard.spaces[i];
            currentSpace.id = i;
            gameboardWrapper.appendChild(currentSpace);

            currentSpace.addEventListener("click", () => handleSpaceClick(currentSpace.id));
        }
    }

    function updateScoreboard() {
        const scoreboard = document.getElementById('scoreboard');
        scoreboard.textContent = `Score: Player 1 (${player1.returnScore()}) - Player 2 (${player2.returnScore()})`;
    }

    return { displayBoardDOM };
})();

playDOM.displayBoardDOM();
