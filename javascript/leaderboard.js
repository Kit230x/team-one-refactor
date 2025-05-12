function fetchAndDisplayLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.style.display = 'flex';
    leaderboardContainer.style.flexWrap = 'wrap';
    leaderboardContainer.style.justifyContent = 'space-around';
  
    const userScoresRef = firebase.database().ref('user_scores');
    const usersRef = firebase.database().ref('users');
    const guestLeaderboardRef = firebase.database().ref('leaderboard'); // Reference for guest scores
    const gamesToShow = ['snake', 'flappy-bird', 'breakout', '2048 game'];
  
    // Reset leaderboard content before fetching new data
    leaderboardContainer.innerHTML = '';
  
    userScoresRef.once('value', (snapshot) => {
      const allUserScores = snapshot.val();
      const gameLeaderboardData = {};
  
      if (allUserScores) {
        // Process each user's scores
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
                  timestamp: scoreData.timestamp,
                });
              }
            }
          }
        }
  
        // Sort scores per game
        for (const gameName in gameLeaderboardData) {
          gameLeaderboardData[gameName].sort((a, b) => Number(b.score) - Number(a.score));
        }
  
        // Display leaderboard for each game
        gamesToShow.forEach(gameName => {
          const gameDiv = document.createElement('div');
          gameDiv.style.width = '45%';
          gameDiv.style.marginBottom = '20px';
  
          const title = document.createElement('h4');
          title.style.textDecoration = 'underline';
          title.textContent = gameName;
          gameDiv.appendChild(title);
  
          // Check if there are scores for the game
          if (gameLeaderboardData[gameName] && gameLeaderboardData[gameName].length > 0) {
            const topScores = gameLeaderboardData[gameName].slice(0, 3);
  
            const scorePromises = topScores.map(entry => {
                return usersRef.child(entry.userId).child('full_name').once('value').then(nameSnap => {
                  const username = nameSnap.exists() ? nameSnap.val() : 'Unknown User';
                  const formattedTime = new Date(entry.timestamp).toLocaleTimeString();
                  return `<li>${username} — Score: ${entry.score} (${formattedTime})</li>`;
                });
              });
              
  
            // Render scores after all data is fetched
            Promise.all(scorePromises).then(items => {
              const ol = document.createElement('ol');
              ol.innerHTML = items.join('');
              gameDiv.appendChild(ol);
              leaderboardContainer.appendChild(gameDiv);
            });
  
          } else {
            // If no scores exist, show 'N/A'
            const noScores = document.createElement('p');
            noScores.textContent = 'No scores yet for this game.';
            gameDiv.appendChild(noScores);
            leaderboardContainer.appendChild(gameDiv);
          }
        });
      } else {
        // If no scores in the database, show a message
        const noScoresInitial = document.createElement('p');
        noScoresInitial.style.textAlign = 'center';
        noScoresInitial.style.width = '100%';
        noScoresInitial.textContent = 'No scores recorded yet.';
        leaderboardContainer.appendChild(noScoresInitial);
      }
    });
  
    // Fetch guest leaderboard data
    guestLeaderboardRef.once('value', (snapshot) => {
      const allGuestScores = snapshot.val();
      const guestLeaderboardData = {};
  
      if (allGuestScores) {
        // Process each guest's scores
        for (const gameName in allGuestScores) {
          if (gamesToShow.includes(gameName)) {
            const gameData = allGuestScores[gameName];
            for (const entryId in gameData) {
              const entry = gameData[entryId];
              if (!guestLeaderboardData[gameName]) {
                guestLeaderboardData[gameName] = [];
              }
              guestLeaderboardData[gameName].push({
                guestId: entry.guestId,
                score: entry.score,
                timestamp: entry.timestamp,
              });
            }
          }
        }
  
        // Sort guest scores per game
        for (const gameName in guestLeaderboardData) {
          guestLeaderboardData[gameName].sort((a, b) => Number(b.score) - Number(a.score));
        }
  
        // Display leaderboard for each game (for guests)
        gamesToShow.forEach(gameName => {
          const gameDiv = document.createElement('div');
          gameDiv.style.width = '45%';
          gameDiv.style.marginBottom = '20px';
  
          const title = document.createElement('h4');
          title.style.textDecoration = 'underline';
          title.textContent = `Guest - ${gameName}`;
          gameDiv.appendChild(title);
  
          // Check if there are guest scores for the game
          if (guestLeaderboardData[gameName] && guestLeaderboardData[gameName].length > 0) {
            const topScores = guestLeaderboardData[gameName].slice(0, 3);
  
            const scorePromises = topScores.map(entry => {
              return `<li>Guest ${entry.guestId} — Score: ${entry.score} (${new Date(entry.timestamp).toLocaleTimeString()})</li>`;
            });
  
            // Render scores after all data is fetched
            Promise.all(scorePromises).then(items => {
              const ol = document.createElement('ol');
              ol.innerHTML = items.join('');
              gameDiv.appendChild(ol);
              leaderboardContainer.appendChild(gameDiv);
            });
  
          } else {
            // If no scores exist, show 'N/A'
            const noScores = document.createElement('p');
            noScores.textContent = 'No scores yet for this game.';
            gameDiv.appendChild(noScores);
            leaderboardContainer.appendChild(gameDiv);
          }
        });
      }
    });
  }
  
  // Displays leaderboard
  fetchAndDisplayLeaderboard();
  