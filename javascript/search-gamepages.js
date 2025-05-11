const searchInput = document.getElementById('gameSearchInput');
const searchResultsContainer = document.getElementById('searchResultsContainer');

// Sample game data (replace with your actual game data)
const gameData = [
  { name: "Tic-Tac-Toe", tags: ["classic", "two-player"], url: "/classic-games/tic-tac-toe.html" },
  { name: "Rock-Paper-Scissors", tags: ["classic", "two-player"], url: "/classic-games/rock-paper-scissors.html" },
  { name: "Blackjack", tags: ["card", "casino"], url: "/classic-games/black-jack.html" },
  { name: "Chess", tags: ["strategy", "board"], url: "/strategy-games/chess.html" },
  { name: "Minesweeper", tags: ["puzzle", "strategy"], url: "/strategy-games/minesweeper.html" },
  { name: "2048 Game", tags: ["puzzle", "number"], url: "/strategy-games/2048.html" },
  { name: "Flappy Bird", tags: ["arcade", "skill"], url: "/arcade-games/flappy-bird.html" },
  { name: "Connect Four", tags: ["strategy", "board"], url: "/arcade-games/connect-four.html" },
  { name: "Breakout", tags: ["arcade", "retro"], url: "/retro-games/breakout.html" },
  { name: "Pong", tags: ["arcade", "retro"], url: "/retro-games/pong.html" },
  { name: "Snake", tags: ["arcade", "retro"], url: "/retro-games/snake.html" },
  { name: "Space Invaders", tags: ["arcade", "shooting"], url: "/retro-games/space-invaders.html" },
  // ... more games - **REPLACE THIS WITH YOUR ACTUAL GAME DATA**
];

function searchGames(query) {
  const lowerCaseQuery = query.toLowerCase().trim();
  return gameData.filter(game =>
    game.name.toLowerCase().includes(lowerCaseQuery) ||
    game.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
}

searchInput.addEventListener('input', function() {
  const query = this.value;
  searchResultsContainer.innerHTML = '';

  if (query) {
    const results = searchGames(query);
    searchResultsContainer.style.display = 'block';

    if (results.length > 0) {
      results.forEach(game => {
        const resultLink = document.createElement('a');
        resultLink.href = game.url;
        resultLink.textContent = game.name;
        resultLink.style.display = 'block';
        resultLink.style.padding = '5px';
        resultLink.style.textDecoration = 'none';
        resultLink.style.color = 'white';
        resultLink.style.transition = 'background-color 0.3s ease';
        resultLink.addEventListener('mouseover', function() {
          this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        resultLink.addEventListener('mouseout', function() {
          this.style.backgroundColor = 'transparent';
        });
        searchResultsContainer.appendChild(resultLink);
      });
    } else {
      searchResultsContainer.textContent = 'No games found.';
    }
  } else {
    searchResultsContainer.style.display = 'none';
  }
});

// Optional: Close search results when clicking outside
document.addEventListener('click', function(event) {
  if (!searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
    searchResultsContainer.style.display = 'none';
  }
});