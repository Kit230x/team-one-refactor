document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("randomButton");

    if (!button) {
        console.error("randomButton not found!");
        return;  // Stop execution if button is missing
    }

    button.addEventListener("click", function () {
        const gamePages = [
            "/arcade-games/breaker-ball.html",
            "/arcade-games/candy-crush.html",
            "/arcade-games/flappy-bird.html",
            "/classic-games/black-jack.html",
            "/classic-games/rock-paper-scissors.html",
            "/classic-games/tic-tac-toe.html",
            "/retro-games/pong.html",
            "/retro-games/space-invaders.html",
            "/retro-games/snake.html",
            "/strategy-games/2048.html",
            "/strategy-games/chess.html",
            "/strategy-games/minesweeper.html",
        ];
        const randomGame = gamePages[Math.floor(Math.random() * gamePages.length)];
        window.location.href = randomGame;
    });
});
