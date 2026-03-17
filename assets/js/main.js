/**
 * YumyTummy Main JavaScript
 * Handles core functionality across all pages
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loader
    initLoader();
    
    // Load header and footer components
    loadComponents();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize fade-in animations
    initFadeInAnimation();
    
    // Initialize cart count from localStorage
    updateCartCount();
    
    // Handle mobile menu toggle (if needed)
    initMobileMenu();
});

/**
 * Loader functionality
 * Hides loader after page is fully loaded
 */
function initLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        // Ensure loader stays for at least 500ms for smooth transition
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
}

/**
 * Load reusable components (header and footer)
 */
function loadComponents() {
    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('components/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                // After header is loaded, update cart count and set active link
                updateCartCount();
                setActiveNavLink();
                
                // Re-initialize mobile menu for new header
                initMobileMenu();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // Fallback header if component fails to load
                headerPlaceholder.innerHTML = getFallbackHeader();
            });
    }
    
    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Fallback footer if component fails to load
                footerPlaceholder.innerHTML = getFallbackFooter();
            });
    }
}

/**
 * Fallback header HTML (in case component fails to load)
 */
function getFallbackHeader() {
    return `
        <header class="header">
            <div class="container header-container">
                <a href="index.html" class="logo">YumyTummy</a>
                <nav class="nav-menu">
                    <a href="index.html" class="nav-link">Home</a>
                    <a href="menu.html" class="nav-link">Menu</a>
                    <a href="#features" class="nav-link">Features</a>
                    <a href="#about" class="nav-link">About</a>
                </nav>
                <div class="header-actions">
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
 * Fallback footer HTML (in case component fails to load)
 */
function getFallbackFooter() {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div>
                        <a href="index.html" class="footer-logo">YumyTummy</a>
                        <p class="footer-description">Delicious food delivered fast to your doorstep. Satisfy your cravings with the best restaurants in town.</p>
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
                            <li><a href="menu.html">Menu</a></li>
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
                        <p class="footer-description">Subscribe to get exclusive offers and updates</p>
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
    
    // If elements are already in view, trigger animation immediately
    fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
    
    // Check on scroll
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
    
    // Update all cart count elements
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

/**
 * Set active navigation link based on current page
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
 * Toast notification system
 */
const Toast = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
            
            // Add styles for toast container
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                
                .toast {
                    background: var(--white);
                    color: var(--dark-gray);
                    padding: 12px 20px;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid var(--primary);
                }
                
                .toast.success {
                    border-left-color: var(--success);
                }
                
                .toast.error {
                    border-left-color: var(--error);
                }
                
                .toast.warning {
                    border-left-color: var(--warning);
                }
                
                .toast.info {
                    border-left-color: var(--info);
                }
                
                .toast-close {
                    margin-left: auto;
                    cursor: pointer;
                    color: var(--gray);
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    show(message, type = 'info', duration = 3000) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <span class="toast-close"><i class="fas fa-times"></i></span>
        `;
        
        this.container.appendChild(toast);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.close(toast);
        });
        
        // Auto close
        if (duration > 0) {
            setTimeout(() => {
                this.close(toast);
            }, duration);
        }
    },
    
    close(toast) {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    },
    
    success(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error(message, duration) {
        this.show(message, 'error', duration);
    },
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    },
    
    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Make Toast globally available
window.Toast = Toast;

/**
 * Add to cart function (for menu items)
 */
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    
    // Check if item already exists in cart
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

// Make addToCart globally available
window.addToCart = addToCart;

/**
 * Format price to currency
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(price);
}

// Make formatPrice globally available
window.formatPrice = formatPrice;