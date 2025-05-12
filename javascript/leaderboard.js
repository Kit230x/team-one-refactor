function fetchAndDisplayLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.style.display = 'flex';
    leaderboardContainer.style.flexWrap = 'wrap';
    leaderboardContainer.style.justifyContent = 'space-around';
  
    const userScoresRef = firebase.database().ref('user_scores');
    const usersRef = firebase.database().ref('users');
    const gamesToShow = ['snake', 'flappy-bird', 'breakout', '2048 game'];
  
    userScoresRef.once('value', (snapshot) => {
      const allUserScores = snapshot.val();
      const gameLeaderboards = {};
  
      // Process all user scores to find top scores for each game
      if (allUserScores) {
        for (const userId in allUserScores) {
          const userGameScores = allUserScores[userId];
          for (const gameName in userGameScores) {
            if (gamesToShow.includes(gameName)) {
              const scores = userGameScores[gameName];
              for (const scoreId in scores) {
                const scoreData = scores[scoreId];
                if (!gameLeaderboards[gameName]) {
                  gameLeaderboards[gameName] = [];
                }
                gameLeaderboards[gameName].push({ userId: userId, score: scoreData.score, timestamp: scoreData.timestamp });
              }
            }
          }
        }
  
        // Sort the leaderboards for each game
        for (const gameName in gameLeaderboards) {
          if (gameLeaderboards[gameName]) {
            gameLeaderboards[gameName].sort((a, b) => b.score - a.score);
          }
        }
      }
  
      // Display the leaderboard for each game
      gamesToShow.forEach(gameName => {
        const gameDiv = document.createElement('div');
        gameDiv.style.width = '45%';
        gameDiv.style.marginBottom = '20px';
  
        const title = document.createElement('h4');
        title.style.textDecoration = 'underline';
        title.textContent = gameName;
        gameDiv.appendChild(title);
  
        if (gameLeaderboards[gameName] && gameLeaderboards[gameName].length > 0) {
          const ol = document.createElement('ol');
          for (let i = 0; i < Math.min(3, gameLeaderboards[gameName].length); i++) {
            const entry = gameLeaderboards[gameName][i];
            usersRef.child(entry.userId).once('value', (userSnapshot) => {
              const userData = userSnapshot.val();
              const username = userData ? userData.full_name : 'Unknown User';
              const formattedTimestamp = new Date(entry.timestamp).toLocaleTimeString();
              const li = document.createElement('li');
              li.textContent = `${username} - Score: ${entry.score} (${formattedTimestamp})`;
              ol.appendChild(li);
              if (i === Math.min(3, gameLeaderboards[gameName].length) - 1) {
                gameDiv.appendChild(ol);
                leaderboardContainer.appendChild(gameDiv);
              } else if (!gameDiv.querySelector('ol')) {
                gameDiv.appendChild(ol); // Append the ol on the first entry
                leaderboardContainer.appendChild(gameDiv);
              }
            });
          }
        } else {
          const noScores = document.createElement('p');
          noScores.textContent = 'N/A';
          gameDiv.appendChild(noScores);
          leaderboardContainer.appendChild(gameDiv);
        }
      });
  
      if (gamesToShow.length > 0 && !allUserScores) {
        const noScoresInitial = document.createElement('p');
        noScoresInitial.textContent = 'No scores recorded yet.';
        leaderboardContainer.appendChild(noScoresInitial);
      }
    });
  }
  
  // Call this function on the index page load
  fetchAndDisplayLeaderboard();