const form = document.getElementById('form');
const username_input = document.getElementById('username-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');  // Only declare this once
const error_message = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    let errors = [];

    if (username_input) {
        errors = getSignupFormErrors(username_input.value, email_input.value, password_input.value, repeat_password_input.value);
    } else {
        errors = getLoginFormErrors(email_input.value, password_input.value);
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join(". ");
    }
});

// Function to validate the signup form
function getSignupFormErrors(username, email, password, repeatPassword) {
    let errors = [];

    if (username === '' || username == null) {
        errors.push('Username is required');
        username_input.parentElement.classList.add('incorrect');
    }

    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }

    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }

    if (password.length < 8) {
        errors.push('Password must have at least 8 characters');
        password_input.parentElement.classList.add('incorrect');
    }

    if (password !== repeatPassword) {
        errors.push('Password does not match repeated password');
        password_input.parentElement.classList.add('incorrect');
        repeat_password_input.parentElement.classList.add('incorrect');
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = []

    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }

    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }
}


const allInputs = [username_input, email_input, password_input, repeat_password_input].filter(input => input != null)

if (username_input && email_input && password_input && repeat_password_input) {
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.parentElement.classList.remove('incorrect');
            error_message.innerText = '';
        });
    });
}


// EMAIL VALIDATION 
form.addEventListener('submit', (e) => {
    let errors = [];

    // Custom email validation
    const emailValue = email_input.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(emailValue)) {
        errors.push('Please enter a valid email address');
        email_input.parentElement.classList.add('incorrect');
    }

    if (username_input) {
        errors = getSignupFormErrors(username_input.value, emailValue, password_input.value, repeat_password_input.value);
    } else {
        errors = getLoginFormErrors(email_input.value, password_input.value);
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join(". ");
    }
});

// Password visibility toggle functionality with image files
const togglePasswordButton = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password-input');
const visibilityOnIcon = document.getElementById('visibility-on');
const visibilityOffIcon = document.getElementById('visibility-off');

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





// CONFIGURATION SECTION

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  
  // Set up our register function
  function register () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    full_name = document.getElementById('full_name').value
    favourite_song = document.getElementById('favourite_song').value
    milk_before_cereal = document.getElementById('milk_before_cereal').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
    if (validate_field(full_name) == false || validate_field(favourite_song) == false || validate_field(milk_before_cereal) == false) {
      alert('One or More Extra Fields is Outta Line!!')
      return
    }
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        favourite_song : favourite_song,
        milk_before_cereal : milk_before_cereal,
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
  
      // DOne
      alert('User Created!!')
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      // DOne
      alert('User Logged In!!')
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  
  
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }