const userScoresDiv = document.getElementById('userScores');
const gamesToShow = ['2048-game', 'minesweeper', 'flappy-bird', 'breakout', 'pong', 'space-invaders'];

function displayTopLeaderboards() {
    const leaderboardRef = firebase.database().ref('game_sessions');
    userScoresDiv.innerHTML = '<h2>Top 3 High Scores</h2>';

    leaderboardRef.once('value', snapshot => {
        const gameSessionsData = snapshot.val();

        if (gameSessionsData) {
            for (const game of gamesToShow) {
                if (gameSessionsData.hasOwnProperty(game)) {
                    const allScores = [];
                    const users = gameSessionsData[game];
                    if (users) {
                        for (const userId in users) {
                            if (users.hasOwnProperty(userId)) {
                                const sessions = users[userId];
                                for (const sessionId in sessions) {
                                    if (sessions.hasOwnProperty(sessionId)) {
                                        allScores.push({ userId: userId, score: sessions[sessionId].score });
                                    }
                                }
                            }
                        }
                        // Sort scores (highest first)
                        allScores.sort((a, b) => b.score - a.score);

                        const gameNameFormatted = game.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        const gameLeaderboardTitle = document.createElement('h3');
                        gameLeaderboardTitle.textContent = `${gameNameFormatted}`;
                        userScoresDiv.appendChild(gameLeaderboardTitle);

                        for (let i = 0; i < Math.min(3, allScores.length); i++) { // Display top 3
                            const scoreEntry = allScores[i];
                            const scoreElement = document.createElement('p');
                            scoreElement.textContent = `Rank ${i + 1}: User ${scoreEntry.userId} - Score: ${scoreEntry.score}`;
                            userScoresDiv.appendChild(scoreElement);
                        }
                        if (allScores.length === 0) {
                            const noScores = document.createElement('p');
                            noScores.textContent = 'No scores recorded yet.';
                            userScoresDiv.appendChild(noScores);
                        }
                    } else {
                        const noScores = document.createElement('p');
                        noScores.textContent = 'No scores recorded yet.';
                        userScoresDiv.appendChild(noScores);
                    }
                }
            }
        } else {
            userScoresDiv.textContent = 'No game session data found.';
        }
    });
}

firebase.auth().onAuthStateChanged(user => {
    displayTopLeaderboards();
});