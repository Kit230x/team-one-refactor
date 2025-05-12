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
      console.log('allUserScores:', allUserScores); // Log all fetched scores

      const gameLeaderboardData = {}; // Store data for each game

      if (allUserScores) {
        for (const userId in allUserScores) {
          const userGameScores = allUserScores[userId];
          console.log('userGameScores for', userId, ':', userGameScores); // Log scores for each user
          for (const gameName in userGameScores) {
            console.log('Found game:', gameName); // Check each game found
            if (gamesToShow.includes(gameName)) {
              const scores = userGameScores[gameName];
              console.log('Scores for', gameName, ':', scores); // Log scores for the current game
              for (const scoreId in scores) {
                const scoreData = scores[scoreId];
                if (!gameLeaderboardData[gameName]) {
                  gameLeaderboardData[gameName] = [];
                }
                gameLeaderboardData[gameName].push({ userId: userId, score: scoreData.score, timestamp: scoreData.timestamp });
              }
            }
          }
        }

        // Sort the leaderboard data for each game
        for (const gameName in gameLeaderboardData) {
          gameLeaderboardData[gameName].sort((a, b) => Number(b.score) - Number(a.score));
          console.log('gameLeaderboardData after sort for', gameName, ':', gameLeaderboardData[gameName]); // Log sorted data
        }
      }

      // Display the leaderboard for each game
      gamesToShow.forEach(gameName => {
        console.log('Processing game in loop:', gameName); // Add this line
        const gameDiv = document.createElement('div');
        gameDiv.style.width = '45%';
        gameDiv.style.marginBottom = '20px';
      
        const title = document.createElement('h4');
        title.style.textDecoration = 'underline';
        title.textContent = gameName;
        gameDiv.appendChild(title);

        let leaderboardHTML = '';
        if (gameLeaderboardData[gameName] && gameLeaderboardData[gameName].length > 0) {
          leaderboardHTML = '<ol>';
          const topScores = gameLeaderboardData[gameName].slice(0, 3);
          let promises = topScores.map(entry => {
            return usersRef.child(entry.userId).once('value').then(userSnapshot => {
              const userData = userSnapshot.val();
              const username = userData ? userData.full_name : 'Unknown User';
              const formattedTimestamp = new Date(entry.timestamp).toLocaleTimeString();
              return `<li>${username} - Score: ${entry.score} (${formattedTimestamp})</li>`;
            });
          });

          Promise.all(promises).then(listItems => {
            leaderboardHTML += listItems.join('');
            leaderboardHTML += '</ol>';
            gameDiv.innerHTML += leaderboardHTML;
            leaderboardContainer.appendChild(gameDiv);
          });
        } else {
          const noScores = document.createElement('p');
          noScores.textContent = 'N/A';
          gameDiv.appendChild(noScores);
          leaderboardContainer.appendChild(gameDiv);
        }
      });

      if (gamesToShow.length > 0 && !allUserScores) {
        const noScoresInitial = document.createElement('<p style="text-align: center; width: 100%;">No scores recorded yet.</p>');
        leaderboardContainer.appendChild(noScoresInitial);
      }
    });
  }

  // Displays leaderboard
  fetchAndDisplayLeaderboard();