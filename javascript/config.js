// CONFIGURATION SECTION

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
      alert('Email or Password field invalid');
      return;
      // Don't continue running the code
    }
    if (!validate_field(full_name)) {
      alert('Username field is empty');
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
       alert('User Created');
       
     })
     .catch(function(error) {
       // Firebase will use this to alert of its errors
       const errorCode = error.code;
       const errorMessage = error.message;
       alert(errorMessage);
       window.location.href = 'index.html';
     });
   }
   // Set up our login function
   function login () {
    // Get all our input fields
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
  
    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
      alert('Email or Password field is invalid');
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
       alert('User Logged in');
  
       // Redirect to the homepage after successful login
       window.location.href = 'index.html';
  
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

// LEADERBOARD TRACKER
function saveGameSession(gameName, score) {
  const user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;
    const timestamp = Date.now();
    const gameSessionsRef = firebase.database().ref(`game_sessions/${gameName}/${userId}`);

    gameSessionsRef.push({
      score: score,
      timestamp: timestamp
    })
    .then(() => {
      console.log(`Score ${score} saved for ${gameName} by user ${userId} at ${new Date(timestamp).toLocaleString()}`);
    })
    .catch((error) => {
      console.error('Error saving game session:', error);
    });
  } else {
    console.log('User not logged in, cannot save score.');
  }
}