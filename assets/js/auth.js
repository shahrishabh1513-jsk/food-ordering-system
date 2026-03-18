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
            
            // Animate
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
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
            // Animate button
            loginBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                loginBtn.style.transform = '';
            }, 200);
            
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
    
    phone.addEventListener('input', function() {
        validatePhone(this);
    });
    
    password.addEventListener('input', function() {
        validatePassword(this);
        updatePasswordRequirements(this.value);
        validatePasswordMatch(password, confirmPassword);
    });
    
    confirmPassword.addEventListener('input', function() {
        validatePasswordMatch(password, this);
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
            firstName.focus();
        }
        
        if (!isLastNameValid) {
            showFieldError(lastName, 'Last name is required');
            lastName.focus();
        }
        
        if (!isTermsChecked) {
            Toast.warning('Please accept terms and conditions');
            terms.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && 
            isPasswordValid && isPasswordMatch && isTermsChecked) {
            
            // Animate button
            const signupBtn = document.getElementById('signupBtn');
            signupBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                signupBtn.style.transform = '';
            }, 200);
            
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
 * Validate phone number (Indian format)
 */
function validatePhone(input) {
    const phone = input.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    
    if (!phone) {
        showFieldError(input, 'Phone number is required');
        return false;
    } else if (!phoneRegex.test(phone.replace(/[\s+-]/g, ''))) {
        showFieldError(input, 'Please enter a valid 10-digit Indian mobile number');
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
        errorElement.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            errorElement.style.animation = '';
        }, 300);
    } else {
        // Find or create error element
        let error = input.parentElement.querySelector('.error-message');
        if (!error) {
            error = document.createElement('div');
            error.className = 'error-message';
            input.parentElement.appendChild(error);
        }
        error.textContent = message;
        error.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            error.style.animation = '';
        }, 300);
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
    const strengthText = document.getElementById('strengthText');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update strength bars
        strengthBars.forEach((bar, index) => {
            bar.classList.remove('weak', 'medium', 'strong');
            if (index < strength.level) {
                bar.classList.add(strength.class);
                
                // Animate bar
                bar.style.animation = 'scaleIn 0.3s ease';
                setTimeout(() => {
                    bar.style.animation = '';
                }, 300);
            }
        });
        
        // Update strength text
        if (strengthText) {
            if (password.length === 0) {
                strengthText.textContent = 'Enter a password';
                strengthText.style.color = 'var(--gray)';
            } else {
                strengthText.textContent = strength.message;
                strengthText.style.color = strength.color;
            }
        }
    });
}

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password) {
    let score = 0;
    
    if (!password) return { level: 0, class: '', message: 'Enter a password', color: 'var(--gray)' };
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) {
        return { 
            level: 1, 
            class: 'weak', 
            message: 'Weak password',
            color: 'var(--error)'
        };
    } else if (score <= 4) {
        return { 
            level: 3, 
            class: 'medium', 
            message: 'Medium password',
            color: 'var(--warning)'
        };
    } else {
        return { 
            level: 5, 
            class: 'strong', 
            message: 'Strong password',
            color: 'var(--success)'
        };
    }
}

/**
 * Update password requirements checklist
 */
function updatePasswordRequirements(password) {
    const reqLength = document.getElementById('reqLength');
    const reqUppercase = document.getElementById('reqUppercase');
    const reqLowercase = document.getElementById('reqLowercase');
    const reqNumber = document.getElementById('reqNumber');
    const reqSpecial = document.getElementById('reqSpecial');
    
    if (reqLength) {
        reqLength.innerHTML = password.length >= 8 ? '✓ At least 8 characters' : '○ At least 8 characters';
        reqLength.style.color = password.length >= 8 ? 'var(--success)' : 'var(--gray)';
    }
    
    if (reqUppercase) {
        reqUppercase.innerHTML = /[A-Z]/.test(password) ? '✓ One uppercase letter' : '○ One uppercase letter';
        reqUppercase.style.color = /[A-Z]/.test(password) ? 'var(--success)' : 'var(--gray)';
    }
    
    if (reqLowercase) {
        reqLowercase.innerHTML = /[a-z]/.test(password) ? '✓ One lowercase letter' : '○ One lowercase letter';
        reqLowercase.style.color = /[a-z]/.test(password) ? 'var(--success)' : 'var(--gray)';
    }
    
    if (reqNumber) {
        reqNumber.innerHTML = /[0-9]/.test(password) ? '✓ One number' : '○ One number';
        reqNumber.style.color = /[0-9]/.test(password) ? 'var(--success)' : 'var(--gray)';
    }
    
    if (reqSpecial) {
        reqSpecial.innerHTML = /[^A-Za-z0-9]/.test(password) ? '✓ One special character' : '○ One special character';
        reqSpecial.style.color = /[^A-Za-z0-9]/.test(password) ? 'var(--success)' : 'var(--gray)';
    }
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
            phone: '9876543210',
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

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Make auth functions globally available
window.isUserLoggedIn = isUserLoggedIn;
window.requireAuth = requireAuth;