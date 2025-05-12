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
      if (allUserScores) {
        const gameLeaderboards = {};
  
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
  
        for (const gameName in gameLeaderboards) {
          gameLeaderboards[gameName].sort((a, b) => b.score - a.score);
          console.log('Sorted scores for', gameName, ':', gameLeaderboards[gameName]); // Debugging sort
  
          const gameDiv = document.createElement('div');
          gameDiv.style.width = '45%';
          gameDiv.style.marginBottom = '20px';
  
          const title = document.createElement('h4');
          title.style.textDecoration = 'underline';
          title.textContent = gameName;
          gameDiv.appendChild(title);
  
          if (gameLeaderboards[gameName].length > 0) {
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
                }
              });
            }
          } else {
            const noScores = document.createElement('p');
            noScores.textContent = 'N/A';
            gameDiv.appendChild(noScores);
            leaderboardContainer.appendChild(gameDiv);
          }
        }
  
        if (Object.keys(gameLeaderboards).length === 0 && gamesToShow.length > 0) {
          const noScoresOverall = document.createElement('p');
          noScoresOverall.textContent = 'No high scores recorded yet for the selected games.';
          leaderboardContainer.appendChild(noScoresOverall);
        }
      } else if (gamesToShow.length > 0) {
        const noScoresInitial = document.createElement('p');
        noScoresInitial.textContent = 'No scores recorded yet.';
        leaderboardContainer.appendChild(noScoresInitial);
      }
    });
  }
  
  // Call this function on the index page load
  fetchAndDisplayLeaderboard();