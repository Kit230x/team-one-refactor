console.log('Auth state listener running...');

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
      logoutButton.style.marginRight = '10px';
      logoutButton.textContent = 'Logout';
      logoutButton.onclick = logoutUser;

      const deleteButton = document.createElement('button');
      deleteButton.id = 'deleteAccountBtn';
      deleteButton.className = 'signup-login nav-hover';
      deleteButton.style.backgroundColor = '#d32f2f'; // Distinct color
      deleteButton.textContent = 'Delete Account';
      deleteButton.onclick = deleteCurrentUser;

      loginSignupDiv.appendChild(logoutButton);
      loginSignupDiv.appendChild(deleteButton);
    } else {
      console.log('User is logged out.');
      loginSignupDiv.innerHTML = `
        <a href="signup.html" class="signup-login nav-hover">Login & Signup</a>
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
  }).catch(function(error) {
    console.error('Error signing out:', error);
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

// Password visibility toggle functionality with image files
const togglePasswordButton = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password-input');
const visibilityOnIcon = document.getElementById('visibility-on');
const visibilityOffIcon = document.getElementById('visibility-off');

if (togglePasswordButton && passwordInput && visibilityOnIcon && visibilityOffIcon) {
  togglePasswordButton.addEventListener('click', () => {
      // Toggle the type of the password input
      const currentType = passwordInput.getAttribute('type');
      if (currentType === 'password') {
          passwordInput.setAttribute('type', 'text'); // Show password
          // Hide the "visibility off" image and show the "visibility on" image
          visibilityOnIcon.style.display = 'none';
          visibilityOffIcon.style.display = 'block';
      } else {
          passwordInput.setAttribute('type', 'password'); // Hide password
          // Hide the "visibility on" image and show the "visibility off" image
          visibilityOnIcon.style.display = 'block';
          visibilityOffIcon.style.display = 'none';
      }
  });
}