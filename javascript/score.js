function saveGameScore(gameName, score) {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const timestamp = Date.now();
      const userScoresRef = firebase.database().ref(`user_scores/${userId}/${gameName}`);
  
      userScoresRef.push({
        score: score,
        timestamp: timestamp
      })
      .then(() => {
        console.log(`Score ${score} saved for ${gameName} by user ${userId} at ${new Date(timestamp).toLocaleString()}`);
      })
      .catch((error) => {
        console.error('Error saving game score:', error);
      });
    } else {
      console.log('User not logged in, cannot save score.');
    }
  }

  function displayUserScores() {
    const userScoresDiv = document.getElementById('userScores');
    userScoresDiv.innerHTML = '<h3>Your Recent Scores</h3>'; // Clear previous content
  
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userId = user.uid;
        const userScoresRef = firebase.database().ref(`user_scores/${userId}`);
  
        userScoresRef.on('value', (snapshot) => {
          const gameScores = snapshot.val();
          if (gameScores) {
            for (const gameName in gameScores) {
              const scores = gameScores[gameName];
              let gameScoreHTML = `<h4>${gameName}</h4><ul>`;
              for (const scoreDataKey in scores) {
                const scoreData = scores[scoreDataKey];
                gameScoreHTML += `<li>Score: ${scoreData.score} (${new Date(scoreData.timestamp).toLocaleTimeString()})</li>`;
              }
              gameScoreHTML += '</ul>';
              userScoresDiv.innerHTML += gameScoreHTML;
            }
          } else {
            userScoresDiv.innerHTML += '<p>No scores recorded yet.</p>';
          }
        });
      } else {
        userScoresDiv.innerHTML = '<p>Log in to see your scores.</p>';
      }
    });
  }
  
  // Call this function when the index page loads
  displayUserScores();