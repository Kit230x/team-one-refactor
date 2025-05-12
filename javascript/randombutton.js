document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("randomButton");

    if (!button) {
        console.error("randomButton not found!");
        return;
    }

    /**
     * TODO: Needs to make something where it doesn't repeat a website 
     *  */ 

    button.addEventListener("click", function () {
        const gamePages = [
            "/retro-games/breakout.html",
            "/arcade-games/flappy-bird.html",
            "/classic-games/black-jack.html",
            "/classic-games/rock-paper-scissors.html",
            "/classic-games/tic-tac-toe.html",
            "/retro-games/pong.html",
            "/retro-games/snake.html",
            "/strategy-games/2048.html",
            "/strategy-games/chess.html",
            "/strategy-games/minesweeper.html",
            "/retro-games/tanks.html",
            "/arcade-games/connect-four.html",
        ];
        const randomGame = gamePages[Math.floor(Math.random() * gamePages.length)];
        window.location.href = randomGame;
    });
});
