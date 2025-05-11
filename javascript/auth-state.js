// javascript/auth-state.js

console.log('Auth state listener running on index.html');

firebase.auth().onAuthStateChanged(function(user) {
  const loginSignupDivs = document.querySelectorAll('.navbar-loginsignup');
  const randomButtons = document.querySelectorAll('#randomButton');

  loginSignupDivs.forEach(loginSignupDiv => {
    if (user) {
      console.log('User is logged in:', user);
      loginSignupDiv.innerHTML = `<button onclick="logoutUser()" class="signup-login nav-hover">Logout</button>`;
    } else {
      console.log('User is logged out.');
      loginSignupDiv.innerHTML = `
        <a href="login.html" class="signup-login nav-hover">Login</a>
        <span>/</span>
        <a href="signup.html" class="signup-login nav-hover">Sign Up</a>
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