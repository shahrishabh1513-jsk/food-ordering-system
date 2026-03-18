/**
 * YumyTummy Main JavaScript
 * Handles core functionality across all pages
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loader
    initLoader();
    
    // Check if current page is index (has built-in header)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage !== 'index.html') {
        // Load header component for non-index pages
        loadHeader();
    }
    
    // Load footer component for all pages
    loadFooter();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize fade-in animations
    initFadeInAnimation();
    
    // Initialize cart count from localStorage
    updateCartCount();
    
    // Handle mobile menu toggle
    initMobileMenu();
    
    // Update header based on login status
    if (currentPage !== 'index.html') {
        updateHeaderAuth();
    }
});

/**
 * Loader functionality
 */
function initLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
}

/**
 * Load header component
 */
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('components/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                updateHeaderAuth();
                updateCartCount();
                setActiveNavLink();
                initMobileMenu();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerPlaceholder.innerHTML = getFallbackHeader();
            });
    }
}

/**
 * Load footer component
 */
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
                initNewsletterForm();
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                footerPlaceholder.innerHTML = getFallbackFooter();
            });
    }
}

/**
 * Update header based on authentication status
 */
function updateHeaderAuth() {
    const headerActions = document.getElementById('headerActions');
    if (!headerActions) return;
    
    const user = JSON.parse(localStorage.getItem('yumytummy_user'));
    
    if (user) {
        // User is logged in - show user menu
        const template = document.getElementById('userMenuTemplate');
        const clone = template.content.cloneNode(true);
        
        // Update user name
        const userNameSpan = clone.querySelector('.user-name');
        if (userNameSpan) {
            userNameSpan.textContent = user.name?.split(' ')[0] || 'User';
        }
        
        // Clear and append
        headerActions.innerHTML = '';
        headerActions.appendChild(clone);
        
        // Add logout handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    } else {
        // User is not logged in - show login/signup buttons
        const template = document.getElementById('authButtonsTemplate');
        const clone = template.content.cloneNode(true);
        
        headerActions.innerHTML = '';
        headerActions.appendChild(clone);
    }
    
    updateCartCount();
}

/**
 * Logout function
 */
function logout() {
    localStorage.removeItem('yumytummy_user');
    Toast.success('Logged out successfully');
    setTimeout(() => {
        updateHeaderAuth();
    }, 1500);
}

/**
 * Fallback header HTML
 */
function getFallbackHeader() {
    return `
        <header class="header">
            <div class="container header-container">
                <a href="index.html" class="logo">YumyTummy</a>
                <nav class="nav-menu">
                    <a href="index.html" class="nav-link">Home</a>
                    <a href="home.html" class="nav-link">Discover</a>
                    <a href="#features" class="nav-link">Features</a>
                    <a href="#about" class="nav-link">About</a>
                    <a href="#contact" class="nav-link">Contact</a>
                </nav>
                <div class="header-actions" id="headerActions">
                    <a href="cart.html" class="cart-icon">
                        <i class="fas fa-shopping-bag"></i>
                        <span class="cart-count">0</span>
                    </a>
                    <a href="login.html" class="btn btn-outline">Login</a>
                    <a href="signup.html" class="btn btn-primary">Sign Up</a>
                    <button class="menu-toggle" id="menuToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </header>
    `;
}

/**
 * Fallback footer HTML
 */
function getFallbackFooter() {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div>
                        <a href="index.html" class="footer-logo">YumyTummy</a>
                        <p class="footer-description">Delicious food delivered fast to your doorstep.</p>
                        <div class="social-links">
                            <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div>
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="index.html">Home</a></li>
                            <li><a href="home.html">Discover</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#about">About Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Support</h3>
                        <ul class="footer-links">
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Newsletter</h3>
                        <form class="newsletter-form" id="newsletterForm">
                            <input type="email" class="newsletter-input" placeholder="Your email" required>
                            <button type="submit" class="newsletter-btn"><i class="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 YumyTummy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
}

/**
 * Initialize newsletter form
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            Toast.success('Thank you for subscribing!');
            form.reset();
        });
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Fade-in animation on scroll
 */
function initFadeInAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
    
    window.addEventListener('scroll', () => {
        fadeElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('fade-in-done')) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('fade-in-done');
            }
        });
    });
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

/**
 * Update cart count in header
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

/**
 * Set active navigation link
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * Add to cart function
 */
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        Toast.success(`${item.name} quantity updated in cart!`);
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
        Toast.success(`${item.name} added to cart!`);
    }
    
    localStorage.setItem('yumytummy_cart', JSON.stringify(cart));
    updateCartCount();
}

// Make functions globally available
window.addToCart = addToCart;
window.logout = logout;
window.formatPrice = (price) => `₹${price}`;