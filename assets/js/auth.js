/**
 * YumyTummy Authentication JavaScript
 * Handles login and signup functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggles
    initPasswordToggles();
    
    // Initialize login form if on login page
    if (document.getElementById('loginForm')) {
        initLoginForm();
    }
    
    // Initialize signup form if on signup page
    if (document.getElementById('signupForm')) {
        initSignupForm();
    }
    
    // Initialize password strength indicator
    if (document.getElementById('password')) {
        initPasswordStrength();
    }
});

/**
 * Initialize password visibility toggles
 */
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
}

/**
 * Initialize login form validation and submission
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    
    // Real-time validation
    emailInput.addEventListener('input', function() {
        validateEmail(this);
    });
    
    passwordInput.addEventListener('input', function() {
        validatePassword(this);
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        
        if (isEmailValid && isPasswordValid) {
            // Simulate login API call
            simulateLogin();
        }
    });
}

/**
 * Initialize signup form validation and submission
 */
function initSignupForm() {
    const signupForm = document.getElementById('signupForm');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    
    // Real-time validation
    email.addEventListener('input', function() {
        validateEmail(this);
    });
    
    password.addEventListener('input', function() {
        validatePassword(this);
        validatePasswordMatch(password, confirmPassword);
    });
    
    confirmPassword.addEventListener('input', function() {
        validatePasswordMatch(password, this);
    });
    
    phone.addEventListener('input', function() {
        validatePhone(this);
    });
    
    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isFirstNameValid = firstName.value.trim() !== '';
        const isLastNameValid = lastName.value.trim() !== '';
        const isEmailValid = validateEmail(email);
        const isPhoneValid = validatePhone(phone);
        const isPasswordValid = validatePassword(password);
        const isPasswordMatch = validatePasswordMatch(password, confirmPassword);
        const isTermsChecked = terms.checked;
        
        if (!isFirstNameValid) {
            showFieldError(firstName, 'First name is required');
        }
        
        if (!isLastNameValid) {
            showFieldError(lastName, 'Last name is required');
        }
        
        if (!isTermsChecked) {
            Toast.warning('Please accept terms and conditions');
        }
        
        if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && 
            isPasswordValid && isPasswordMatch && isTermsChecked) {
            // Simulate signup API call
            simulateSignup();
        }
    });
}

/**
 * Validate email field
 */
function validateEmail(input) {
    const email = input.value.trim();
    const errorElement = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(input, 'Email is required', errorElement);
        return false;
    } else if (!emailRegex.test(email)) {
        showFieldError(input, 'Please enter a valid email', errorElement);
        return false;
    } else {
        showFieldSuccess(input, errorElement);
        return true;
    }
}

/**
 * Validate password field
 */
function validatePassword(input) {
    const password = input.value;
    const errorElement = document.getElementById('passwordError');
    
    if (!password) {
        showFieldError(input, 'Password is required', errorElement);
        return false;
    } else if (password.length < 8) {
        showFieldError(input, 'Password must be at least 8 characters', errorElement);
        return false;
    } else {
        showFieldSuccess(input, errorElement);
        return true;
    }
}

/**
 * Validate password match
 */
function validatePasswordMatch(passwordInput, confirmInput) {
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (!confirmPassword) {
        showFieldError(confirmInput, 'Please confirm your password', errorElement);
        return false;
    } else if (password !== confirmPassword) {
        showFieldError(confirmInput, 'Passwords do not match', errorElement);
        return false;
    } else {
        showFieldSuccess(confirmInput, errorElement);
        return true;
    }
}

/**
 * Validate phone number
 */
function validatePhone(input) {
    const phone = input.value.trim();
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    
    if (!phone) {
        showFieldError(input, 'Phone number is required');
        return false;
    } else if (!phoneRegex.test(phone)) {
        showFieldError(input, 'Please enter a valid phone number');
        return false;
    } else {
        showFieldSuccess(input);
        return true;
    }
}

/**
 * Show field error
 */
function showFieldError(input, message, errorElement = null) {
    input.classList.add('error');
    input.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        // Find or create error element
        let error = input.parentElement.querySelector('.error-message');
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-message';
            input.parentElement.appendChild(error);
        }
        error.textContent = message;
    }
}

/**
 * Show field success
 */
function showFieldSuccess(input, errorElement = null) {
    input.classList.remove('error');
    input.classList.add('success');
    
    if (errorElement) {
        errorElement.textContent = '';
    } else {
        const error = input.parentElement.querySelector('.error-message');
        if (error) {
            error.textContent = '';
        }
    }
}

/**
 * Initialize password strength indicator
 */
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthBars = document.querySelectorAll('.strength-bar');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update strength bars
        strengthBars.forEach((bar, index) => {
            bar.classList.remove('weak', 'medium', 'strong');
            if (index < strength.level) {
                bar.classList.add(strength.class);
            }
        });
    });
}

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password) {
    let score = 0;
    
    if (!password) return { level: 0, class: '' };
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { level: 1, class: 'weak' };
    if (score <= 4) return { level: 3, class: 'medium' };
    return { level: 4, class: 'strong' };
}

/**
 * Simulate login API call
 */
function simulateLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.innerHTML;
    
    // Show loading state
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store user info in localStorage (simulated)
        const user = {
            name: 'John Doe',
            email: document.getElementById('email').value,
            isLoggedIn: true
        };
        localStorage.setItem('yumytummy_user', JSON.stringify(user));
        
        Toast.success('Login successful! Redirecting...');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    }, 2000);
}

/**
 * Simulate signup API call
 */
function simulateSignup() {
    const signupBtn = document.getElementById('signupBtn');
    const originalText = signupBtn.innerHTML;
    
    // Show loading state
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    signupBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store user info in localStorage
        const user = {
            name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            isLoggedIn: true
        };
        localStorage.setItem('yumytummy_user', JSON.stringify(user));
        
        Toast.success('Account created successfully! Redirecting...');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    }, 2000);
}

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
    const user = localStorage.getItem('yumytummy_user');
    return user ? JSON.parse(user).isLoggedIn : false;
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    if (!isUserLoggedIn()) {
        Toast.warning('Please login to continue');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// Make auth functions globally available
window.isUserLoggedIn = isUserLoggedIn;
window.requireAuth = requireAuth;