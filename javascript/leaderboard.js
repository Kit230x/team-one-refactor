const userScoresDiv = document.getElementById('userScores');
const gamesToShow = ['2048-game', 'minesweeper', 'flappy-bird', 'breakout', 'pong', 'space-invaders'];

function displayTopLeaderboards() {
    const leaderboardRef = firebase.database().ref('game_sessions');
    userScoresDiv.innerHTML = '<h2 style="text-align: center;">High Scores!</h2><div style="display: flex; flex-wrap: wrap; justify-content: space-around;"></div>';
    const leaderboardContainer = userScoresDiv.querySelector('div');

    leaderboardRef.on('value', snapshot => { // Listener for database changes - BLOCK START
        const gameSessionsData = snapshot.val();
        leaderboardContainer.innerHTML = ''; // Clear previous data

        if (gameSessionsData) { // Check if there is game session data - BLOCK START
            for (const game of gamesToShow) { // Loop through each game - BLOCK START
                const allScores = [];
                if (gameSessionsData.hasOwnProperty(game)) { // Check if data exists for the current game - BLOCK START
                    const users = gameSessionsData[game];
                    if (users) { // Check if there are users for the current game - BLOCK START
                        for (const userId in users) { // Loop through each user - BLOCK START
                            if (users.hasOwnProperty(userId)) {
                                const sessions = users[userId];
                                for (const sessionId in sessions) { // Loop through each session - BLOCK START
                                    if (sessions.hasOwnProperty(sessionId)) {
                                        allScores.push({ userId: userId, score: sessions[sessionId].score });
                                    } // END session loop
                                } // END all sessions loop
                            } // END user check
                        } // END users loop
                    } // END users check
                    allScores.sort((a, b) => b.score - a.score);
                } // END game data check

                const gameNameFormatted = game.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                const gameColumn = document.createElement('div');
                gameColumn.style.flexBasis = 'calc(50% - 20px)';
                gameColumn.style.margin = '10px';
                const gameLeaderboardTitle = document.createElement('h3');
                gameLeaderboardTitle.textContent = `${gameNameFormatted}`;
                gameColumn.appendChild(gameLeaderboardTitle);

                if (allScores.length > 0) { // Check if there are scores to display - BLOCK START
                    const scoreList = document.createElement('ol');
                    for (let i = 0; i < Math.min(3, allScores.length); i++) {
                        const scoreEntry = allScores[i];
                        const listItem = document.createElement('li');
                        listItem.textContent = `Player ${scoreEntry.userId}: ${scoreEntry.score}`;
                        scoreList.appendChild(listItem);
                    }
                    gameColumn.appendChild(scoreList);
                } else { // If no scores - BLOCK START
                    const noScores = document.createElement('p');
                    noScores.textContent = 'No high scores yet.';
                    gameColumn.appendChild(noScores);
                } // END no scores check
                leaderboardContainer.appendChild(gameColumn);
            } // END games loop
        } else { // If no game session data at all - BLOCK START
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'No game session data found.';
            leaderboardContainer.appendChild(noDataMessage);
        } // END game session data check
    }); // END listener for database changes
}

// Call displayTopLeaderboards directly when the script loads
displayTopLeaderboards();