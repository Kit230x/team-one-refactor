// CONFIGURATION SECTION

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBX7ByqFoHMZxOYi1OAbxQZWoj2f6jUNfk",
    authDomain: "login-t1-ca2a1.firebaseapp.com",
    databaseURL: "https://login-t1-ca2a1-default-rtdb.firebaseio.com",
    projectId: "login-t1-ca2a1",
    storageBucket: "login-t1-ca2a1.firebasestorage.app",
    messagingSenderId: "370052558614",
    appId: "1:370052558614:web:767d72363b7314eafeea37",
    measurementId: "G-P4FYT0V379"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize variables
  const auth = firebase.auth();
  const database = firebase.database();
  
  function register () {
    // Get all our input fields
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let full_name = document.getElementById('full_name').value;
  
    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
      alert('Email or Password is Outta Line!!');
      return;
      // Don't continue running the code
    }
    if (!validate_field(full_name)) {
      alert('Full Name is Outta Line!!');
      return;
    }
  
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      const user = auth.currentUser;
  
      // Add this user to Firebase Database
      const database_ref = database.ref('users/' + user.uid);
  
      // Create User data
      const user_data = {
        email: email,
        full_name: full_name,
        last_login: Date.now()
      };
  
      // Push to Firebase Database
      database_ref.set(user_data);
  
      // Done
      alert('User Created!!');
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
  }
  // Set up our login function
  function login () {
    // Get all our input fields
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
  
    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
      alert('Email or Password is Outta Line!!');
      return;
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      const user = auth.currentUser;
  
      // Add this user to Firebase Database
      const database_ref = database.ref('users/' + user.uid);
  
      // Create User data
      const user_data = {
        last_login: Date.now()
      };
  
      // Push to Firebase Database
      database_ref.update(user_data);
  
      // Done
      alert('User Logged In!!');
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
  }
  
  // Validate Functions
  function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    return password.length >= 6;
  }
  
  function validate_field(field) {
    return field != null && field.length > 0;
  }


// javascript/auth-state.js

console.log('Auth state listener running...');

firebase.auth().onAuthStateChanged(function(user) {
  const loginSignupDivs = document.querySelectorAll('.navbar-loginsignup');
  const randomButtons = document.querySelectorAll('#randomButton');
  const topRightContainer = document.querySelector('.right-container'); // Assuming your right-container is where you want the button

  loginSignupDivs.forEach(loginSignupDiv => {
    if (user) {
      console.log('User is logged in:', user);
      loginSignupDiv.innerHTML = `<button onclick="logoutUser()" class="signup-login nav-hover">Logout</button>`;
      // Add Delete Account button if not already present
      if (!topRightContainer.querySelector('#deleteAccountBtn')) {
        const deleteButton = document.createElement('button');
        deleteButton.id = 'deleteAccountBtn';
        deleteButton.className = 'signup-login nav-hover';
        deleteButton.style.marginLeft = '10px'; // Add some spacing
        deleteButton.textContent = 'Delete Account';
        deleteButton.onclick = deleteCurrentUser;
        topRightContainer.appendChild(deleteButton);
      }
    } else {
      console.log('User is logged out.');
      loginSignupDiv.innerHTML = `
        <a href="login.html" class="signup-login nav-hover">Login</a>
        <span>/</span>
        <a href="signup.html" class="signup-login nav-hover">Sign Up</a>
      `;
      // Remove Delete Account button if present
      const deleteButton = topRightContainer.querySelector('#deleteAccountBtn');
      if (deleteButton) {
        topRightContainer.removeChild(deleteButton);
      }
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

function deleteCurrentUser() {
  const user = firebase.auth().currentUser;

  if (user) {
    const confirmation = confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (confirmation) {
      user.delete().then(() => {
        console.log('User account deleted successfully');
        // The auth state listener will likely trigger, updating the UI.
        alert('Your account has been deleted.');
      }).catch((error) => {
        console.error('Error deleting user account:', error);
        alert('There was an error deleting your account.');
        // You might need to re-authenticate the user if it's a sensitive action.
        // Common errors include "auth/requires-recent-login".
      });
    }
  } else {
    alert('No user is currently logged in.');
  }
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

      // First, delete the user's data from the database
      userDatabaseRef.remove()
        .then(() => {
          console.log('User data removed from database.');
          // Only after the database data is removed, delete the auth account
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