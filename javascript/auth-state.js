console.log('Auth state listener running');

firebase.auth().onAuthStateChanged(function(user) {
  const loginSignupDivs = document.querySelectorAll('.navbar-loginsignup');
  const randomButton = document.getElementById('randomButton');
  const topRightContainer = document.querySelector('.right-container'); 

  loginSignupDivs.forEach(loginSignupDiv => {
    loginSignupDiv.innerHTML = ''; // Clear existing content
    if (user) {
      console.log('User is logged in:', user);
      const logoutButton = document.createElement('button');
      logoutButton.className = 'signup-login nav-hover';
      logoutButton.style.backgroundColor = 'transparent'; 
      logoutButton.style.color = 'white'; 
      logoutButton.style.border = 'none';
      logoutButton.style.cursor = 'pointer'; 
      logoutButton.style.fontWeight = 'bold';
      logoutButton.style.fontSize = '1em'; 
      logoutButton.style.transition = 'color 0.3s ease'; 
      loginSignupDiv.style.marginTop = '0';
      loginSignupDiv.style.marginRight = '0';
      logoutButton.addEventListener('mouseover', function() {
        this.style.color = '#666'; 
      });
      logoutButton.addEventListener('mouseout', function() {
        this.style.color = 'white'; 
      });
      logoutButton.textContent = 'Logout';
      logoutButton.onclick = logoutUser;

      const deleteButton = document.createElement('button');
      deleteButton.id = 'deleteAccountBtn';
      deleteButton.className = 'signup-login nav-hover';
      deleteButton.style.backgroundColor = 'transparent'; 
      deleteButton.style.color = 'white'; 
      deleteButton.style.border = 'none'; 
      deleteButton.style.cursor = 'pointer'; 
      deleteButton.style.fontWeight = 'bold';
      deleteButton.style.fontSize = '1em';
      deleteButton.style.transition = 'color 0.3s ease'; 
      deleteButton.addEventListener('mouseover', function() {
        this.style.color = '#ffaaaa';
      });
      deleteButton.addEventListener('mouseout', function() {
        this.style.color = 'white';
      });
      deleteButton.textContent = 'Delete Account';
      deleteButton.onclick = deleteCurrentUser;

      loginSignupDiv.appendChild(logoutButton);
      loginSignupDiv.appendChild(deleteButton);
      
    } else {
      console.log('User is logged out.');
      loginSignupDiv.innerHTML = `
        <a href="../signup.html" class="signup-login nav-hover">Login & Signup</a>
      `;
    }
  });

  randomButtons.forEach(randomButton => {
    if (user) {
      randomButton.style.display = 'inline-block';
    } else {
      randomButton.style.display = 'none';
    }
  });
});

function logoutUser() {
  firebase.auth().signOut().then(function() {
    console.log('User signed out');
    window.location.href = '../signup.html'; // Redirect to signup page after logout
  }).catch(function(error) {
    console.error('Error signing out:', error);
    alert('Error signing out.');
  });
}

// FUNCTION THAT REMOVES INFORMATION FROM DATABASE ITSELF
function deleteCurrentUser() {
  const user = firebase.auth().currentUser;

  if (user) {
    const confirmation = confirm("Are you sure you want to delete your account AND all your associated data? This cannot be undone.");
    if (confirmation) {
      const userId = user.uid;
      // Reference to the user's data in the Realtime Database
      const userDatabaseRef = firebase.database().ref(`users/${userId}`);

      // Delete the user's data from the database
      userDatabaseRef.remove()
        .then(() => {
          console.log('User data removed from database.');
          // Delete the auth account now
          return user.delete();
        })
        .then(() => {
          console.log('User account deleted successfully');
          alert('Your account and all associated data have been deleted.');
          window.location.href = '../signup.html'; // Redirect to signup page after delete
        })
        .catch((error) => {
          console.error('Error deleting user account and/or data:', error);
          alert('There was an error deleting your account and/or data.');
          // Handle potential re-authentication errors here
        });
    }
  } else {
    alert('No user is currently logged in.');
  }
}