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



