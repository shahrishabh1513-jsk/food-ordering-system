/**
 * YumyTummy Home Page JavaScript
 * Handles home page specific functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load data
    loadBrands();
    loadTopSellingFoods();
    loadRestaurants();
    
    // Initialize search functionality
    initSearch();
    
    // Check authentication status
    updateAuthUI();
});

/**
 * Load brands for slider
 */
function loadBrands() {
    const brands = [
        { id: 1, name: 'McDonald\'s', image: 'https://images.unsplash.com/photo-1559304820-ef088ee9e2b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.5, items: 50 },
        { id: 2, name: 'KFC', image: 'https://images.unsplash.com/photo-1625124741492-58401c4a1b9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.3, items: 40 },
        { id: 3, name: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.4, items: 45 },
        { id: 4, name: 'Subway', image: 'https://images.unsplash.com/photo-1553901753-215db344677a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.2, items: 35 },
        { id: 5, name: 'Taco Bell', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.1, items: 30 },
        { id: 6, name: 'Burger King', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.3, items: 42 },
        { id: 7, name: 'Domino\'s', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.4, items: 38 },
        { id: 8, name: 'Starbucks', image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.6, items: 55 }
    ];
    
    const slider = document.getElementById('brandSlider');
    if (!slider) return;
    
    slider.innerHTML = brands.map(brand => `
        <div class="brand-card" onclick="window.location.href='menu.html?brand=${brand.id}'">
            <div class="brand-image">
                <img src="${brand.image}" alt="${brand.name}" loading="lazy">
            </div>
            <div class="brand-info">
                <h4>${brand.name}</h4>
                <p>
                    <i class="fas fa-star"></i>
                    ${brand.rating} (${brand.items}+ items)
                </p>
            </div>
        </div>
    `).join('');
}

/**
 * Load top selling foods
 */
function loadTopSellingFoods() {
    const foods = [
        {
            id: 1,
            name: 'Margherita Pizza',
            restaurant: 'Pizza Hut',
            price: 14.99,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Best Seller'
        },
        {
            id: 2,
            name: 'Classic Cheeseburger',
            restaurant: 'Burger King',
            price: 11.99,
            rating: 4.3,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Hot'
        },
        {
            id: 3,
            name: 'Chicken Bucket',
            restaurant: 'KFC',
            price: 24.99,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1625124741492-58401c4a1b9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Family Pack'
        },
        {
            id: 4,
            name: 'Grilled Sandwich',
            restaurant: 'Subway',
            price: 8.99,
            rating: 4.2,
            image: 'https://images.unsplash.com/photo-1553901753-215db344677a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Healthy'
        },
        {
            id: 5,
            name: 'Tacos Supreme',
            restaurant: 'Taco Bell',
            price: 12.99,
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Spicy'
        },
        {
            id: 6,
            name: 'Whopper Meal',
            restaurant: 'Burger King',
            price: 15.99,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Popular'
        },
        {
            id: 7,
            name: 'Pepperoni Pizza',
            restaurant: 'Domino\'s',
            price: 16.99,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Chef\'s Special'
        },
        {
            id: 8,
            name: 'Caramel Frappe',
            restaurant: 'Starbucks',
            price: 5.99,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'New'
        }
    ];
    
    const grid = document.getElementById('topSellingGrid');
    if (!grid) return;
    
    grid.innerHTML = foods.map(food => `
        <div class="food-card">
            ${food.badge ? `<span class="food-badge">${food.badge}</span>` : ''}
            <div class="food-image">
                <img src="${food.image}" alt="${food.name}" loading="lazy">
            </div>
            <div class="food-content">
                <div class="food-header">
                    <div>
                        <h4>${food.name}</h4>
                        <span class="rating">
                            <i class="fas fa-star"></i> ${food.rating}
                        </span>
                    </div>
                </div>
                <p class="food-restaurant">
                    <i class="fas fa-store"></i> ${food.restaurant}
                </p>
                <div class="food-footer">
                    <span class="food-price">$${food.price}</span>
                    <button class="add-to-cart" onclick="addToCartFromHome(${food.id}, '${food.name}', ${food.price}, '${food.image}', '${food.restaurant}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Load restaurants
 */
function loadRestaurants() {
    const restaurants = [
        {
            id: 1,
            name: 'Pizza Paradise',
            cuisine: 'Italian, Pizza',
            rating: 4.5,
            time: '25-30 min',
            price: '$$',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: '50% OFF up to ₹100'
        },
        {
            id: 2,
            name: 'Burger Junction',
            cuisine: 'American, Fast Food',
            rating: 4.3,
            time: '20-25 min',
            price: '$',
            image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: 'Buy 1 Get 1 Free'
        },
        {
            id: 3,
            name: 'Sushi Master',
            cuisine: 'Japanese, Sushi',
            rating: 4.7,
            time: '30-35 min',
            price: '$$$',
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: '20% OFF on first order'
        },
        {
            id: 4,
            name: 'Taco Fiesta',
            cuisine: 'Mexican',
            rating: 4.4,
            time: '20-30 min',
            price: '$$',
            image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: 'Free Nachos'
        },
        {
            id: 5,
            name: 'Curry House',
            cuisine: 'Indian, Curry',
            rating: 4.6,
            time: '25-35 min',
            price: '$$',
            image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: '15% OFF on orders above $30'
        },
        {
            id: 6,
            name: 'Dragon Wok',
            cuisine: 'Chinese, Thai',
            rating: 4.2,
            time: '25-30 min',
            price: '$$',
            image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: 'Free Drink'
        }
    ];
    
    const grid = document.getElementById('restaurantGrid');
    if (!grid) return;
    
    grid.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" onclick="window.location.href='menu.html?restaurant=${restaurant.id}'">
            <div class="restaurant-image">
                <img src="${restaurant.image}" alt="${restaurant.name}" loading="lazy">
                <span class="restaurant-offer">${restaurant.offer}</span>
            </div>
            <div class="restaurant-info">
                <div class="restaurant-header">
                    <h3>${restaurant.name}</h3>
                    <span class="restaurant-rating">
                        <i class="fas fa-star"></i> ${restaurant.rating}
                    </span>
                </div>
                <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                <div class="restaurant-details">
                    <span><i class="fas fa-clock"></i> ${restaurant.time}</span>
                    <span><i class="fas fa-tag"></i> ${restaurant.price}</span>
                </div>
                <button class="order-btn" onclick="event.stopPropagation(); window.location.href='menu.html?restaurant=${restaurant.id}'">
                    Order Now <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `menu.html?search=${encodeURIComponent(query)}`;
        }
    };
    
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

/**
 * Add to cart from home page
 */
function addToCartFromHome(id, name, price, image, restaurant) {
    const item = {
        id,
        name,
        price,
        image,
        restaurant
    };
    
    addToCart(item);
}

/**
 * Update UI based on authentication status
 */
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('yumytummy_user'));
    const headerActions = document.querySelector('.header-actions');
    
    if (user && headerActions) {
        // Replace login/signup with user menu
        const authButtons = headerActions.querySelectorAll('.btn-outline, .btn-primary');
        authButtons.forEach(btn => btn.remove());
        
        // Add user menu if not already present
        if (!headerActions.querySelector('.user-menu')) {
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <button class="user-menu-btn">
                    <i class="fas fa-user-circle"></i>
                    <span>${user.name.split(' ')[0]}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown">
                    <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                    <a href="orders.html"><i class="fas fa-shopping-bag"></i> Orders</a>
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            `;
            headerActions.appendChild(userMenu);
            
            // Add logout handler
            document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
}

/**
 * Logout function
 */
function logout() {
    localStorage.removeItem('yumytummy_user');
    Toast.success('Logged out successfully');
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Make functions globally available
window.addToCartFromHome = addToCartFromHome;
window.logout = logout;