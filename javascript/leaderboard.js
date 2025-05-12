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
      const gameLeaderboardData = {};
  
      if (allUserScores) {
        for (const userId in allUserScores) {
          const userGameScores = allUserScores[userId];
          for (const gameName in userGameScores) {
            if (gamesToShow.includes(gameName)) {
              const scores = userGameScores[gameName];
              for (const scoreId in scores) {
                const scoreData = scores[scoreId];
                if (!gameLeaderboardData[gameName]) {
                  gameLeaderboardData[gameName] = [];
                }
                gameLeaderboardData[gameName].push({
                  userId: userId,
                  score: scoreData.score,
                  timestamp: scoreData.timestamp
                });
              }
            }
          }
        }
  
        // Sort scores per game
        for (const gameName in gameLeaderboardData) {
          gameLeaderboardData[gameName].sort((a, b) => Number(b.score) - Number(a.score));
        }
  
        // Display leaderboard
        gamesToShow.forEach(gameName => {
          const gameDiv = document.createElement('div');
          gameDiv.style.width = '45%';
          gameDiv.style.marginBottom = '20px';
  
          const title = document.createElement('h4');
          title.style.textDecoration = 'underline';
          title.textContent = gameName;
          gameDiv.appendChild(title);
  
          if (gameLeaderboardData[gameName] && gameLeaderboardData[gameName].length > 0) {
            const topScores = gameLeaderboardData[gameName].slice(0, 3);
  
            const scorePromises = topScores.map(entry => {
              return usersRef.child(entry.userId).once('value').then(userSnap => {
                const userData = userSnap.val();
                const username = userData ? userData.full_name : 'Unknown User';
                const formattedTime = new Date(entry.timestamp).toLocaleTimeString();
                return `<li>${username} — Score: ${entry.score} (${formattedTime})</li>`;
              });
            });
  
            Promise.all(scorePromises).then(items => {
              const ol = document.createElement('ol');
              ol.innerHTML = items.join('');
              gameDiv.appendChild(ol);
              leaderboardContainer.appendChild(gameDiv);
            });
          } else {
            const noScores = document.createElement('p');
            noScores.textContent = 'N/A';
            gameDiv.appendChild(noScores);
            leaderboardContainer.appendChild(gameDiv);
          }
        });
      } else {
        const noScoresInitial = document.createElement('p');
        noScoresInitial.style.textAlign = 'center';
        noScoresInitial.style.width = '100%';
        noScoresInitial.textContent = 'No scores recorded yet.';
        leaderboardContainer.appendChild(noScoresInitial);
      }
    });
  }

  // Displays leaderboard
  fetchAndDisplayLeaderboard();