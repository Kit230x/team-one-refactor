const userScoresDiv = document.getElementById('userScores');
const gamesToShow = ['2048-game', 'flappy-bird', 'breakout', 'pong', 'space-invaders'];

function displayTopLeaderboards() {
    const leaderboardRef = firebase.database().ref('game_sessions');
    userScoresDiv.innerHTML = '<h2 style="text-align: center;">High Scores!</h2><div style="display: flex; flex-wrap: wrap; justify-content: space-around;"></div>';
    const leaderboardContainer = userScoresDiv.querySelector('div');

    leaderboardRef.on('value', snapshot => {
        const gameSessionsData = snapshot.val();
        leaderboardContainer.innerHTML = ''; // Clear previous game leaderboards

        if (gameSessionsData) {
            for (const game of gamesToShow) {
                const allScores = [];
                if (gameSessionsData.hasOwnProperty(game)) {
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
                        allScores.sort((a, b) => b.score - a.score);
                    }

                    const gameNameFormatted = game.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    const gameColumn = document.createElement('div');
                    gameColumn.style.flexBasis = 'calc(50% - 20px)';
                    gameColumn.style.margin = '10px';
                    const gameLeaderboardTitle = document.createElement('h3');
                    gameLeaderboardTitle.textContent = `${gameNameFormatted}`;
                    gameColumn.appendChild(gameLeaderboardTitle);

                    if (allScores.length > 0) {
                        const scoreList = document.createElement('ol');
                        for (let i = 0; i < Math.min(3, allScores.length); i++) {
                            const scoreEntry = allScores[i];
                            const listItem = document.createElement('li');
                            listItem.textContent = `Player ${scoreEntry.userId}: ${scoreEntry.score}`;
                            scoreList.appendChild(listItem);
                        }
                        gameColumn.appendChild(scoreList);
                    } else {
                        const noScores = document.createElement('p');
                        noScores.textContent = 'No high scores yet.';
                        gameColumn.appendChild(noScores);
                    }
                    leaderboardContainer.appendChild(gameColumn);
                } else {
                    const gameNameFormatted = game.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    const gameColumn = document.createElement('div');
                    gameColumn.style.flexBasis = 'calc(50% - 20px)';
                    gameColumn.style.margin = '10px';
                    const gameLeaderboardTitle = document.createElement('h3');
                    gameLeaderboardTitle.textContent = `${gameNameFormatted}`;
                    gameColumn.appendChild(gameLeaderboardTitle);
                    const noScores = document.createElement('p');
                    noScores.textContent = 'No high scores yet.';
                    gameColumn.appendChild(noScores);
                    leaderboardContainer.appendChild(gameColumn);
                }
            }
        } else {
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'No game session data found.';
            userScoresDiv.appendChild(noDataMessage); // Append to userScoresDiv
        }
    });
}

// Call displayTopLeaderboards directly when the script loads
displayTopLeaderboards();