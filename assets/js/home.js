/**
 * YumyTummy Home Page JavaScript
 * Handles home page specific functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load data
    loadBrands();
    loadTopSellingFoods();
    loadRestaurants();
    loadCuisines();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize quick filters
    initQuickFilters();
    
    // Initialize offer timer
    initOfferTimer();
    
    // Load user preferences
    loadUserPreferences();
});

/**
 * Load brands for auto-scrolling slider
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
        { id: 8, name: 'Starbucks', image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.6, items: 55 },
        { id: 9, name: 'Dunkin\'', image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.2, items: 32 },
        { id: 10, name: 'Chipotle', image: 'https://images.unsplash.com/photo-1583309219338-a65c4fa0b3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', rating: 4.5, items: 28 }
    ];
    
    const slider = document.getElementById('brandSlider');
    if (!slider) return;
    
    // Shuffle brands for variety
    const shuffled = [...brands].sort(() => 0.5 - Math.random());
    
    slider.innerHTML = shuffled.map(brand => `
        <div class="brand-card" onclick="window.location.href='restaurant-menu.html?restaurant=${brand.id}'">
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
            restaurantId: 3,
            price: 399,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Best Seller'
        },
        {
            id: 2,
            name: 'Classic Cheeseburger',
            restaurant: 'Burger King',
            restaurantId: 6,
            price: 249,
            rating: 4.3,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Hot'
        },
        {
            id: 3,
            name: 'Chicken Bucket',
            restaurant: 'KFC',
            restaurantId: 2,
            price: 599,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1625124741492-58401c4a1b9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Family Pack'
        },
        {
            id: 4,
            name: 'Grilled Sandwich',
            restaurant: 'Subway',
            restaurantId: 4,
            price: 199,
            rating: 4.2,
            image: 'https://images.unsplash.com/photo-1553901753-215db344677a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Healthy'
        },
        {
            id: 5,
            name: 'Tacos Supreme',
            restaurant: 'Taco Bell',
            restaurantId: 5,
            price: 299,
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Spicy'
        },
        {
            id: 6,
            name: 'Whopper Meal',
            restaurant: 'Burger King',
            restaurantId: 6,
            price: 399,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Popular'
        },
        {
            id: 7,
            name: 'Pepperoni Pizza',
            restaurant: 'Domino\'s',
            restaurantId: 7,
            price: 499,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Chef\'s Special'
        },
        {
            id: 8,
            name: 'Caramel Frappe',
            restaurant: 'Starbucks',
            restaurantId: 8,
            price: 299,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'New'
        }
    ];
    
    const grid = document.getElementById('topSellingGrid');
    if (!grid) return;
    
    grid.innerHTML = foods.map(food => `
        <div class="food-card" onclick="window.location.href='restaurant-menu.html?restaurant=${food.restaurantId}'">
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
                    <span class="food-price">₹${food.price}</span>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCartFromHome(${JSON.stringify(food).replace(/"/g, '&quot;')})">
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
            price: '₹₹',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: '50% OFF up to ₹100'
        },
        {
            id: 2,
            name: 'Burger Junction',
            cuisine: 'American, Fast Food',
            rating: 4.3,
            time: '20-25 min',
            price: '₹',
            image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: 'Buy 1 Get 1 Free'
        },
        {
            id: 3,
            name: 'Sushi Master',
            cuisine: 'Japanese, Sushi',
            rating: 4.7,
            time: '30-35 min',
            price: '₹₹₹',
            image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: '20% OFF on first order'
        },
        {
            id: 4,
            name: 'Taco Fiesta',
            cuisine: 'Mexican',
            rating: 4.4,
            time: '20-30 min',
            price: '₹₹',
            image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: 'Free Nachos'
        },
        {
            id: 5,
            name: 'Curry House',
            cuisine: 'Indian, Curry',
            rating: 4.6,
            time: '25-35 min',
            price: '₹₹',
            image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: '15% OFF on orders above ₹500'
        },
        {
            id: 6,
            name: 'Dragon Wok',
            cuisine: 'Chinese, Thai',
            rating: 4.2,
            time: '25-30 min',
            price: '₹₹',
            image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            offer: 'Free Drink'
        }
    ];
    
    const grid = document.getElementById('restaurantGrid');
    if (!grid) return;
    
    grid.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" onclick="window.location.href='restaurant-menu.html?restaurant=${restaurant.id}'">
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
                <button class="order-btn" onclick="event.stopPropagation(); window.location.href='restaurant-menu.html?restaurant=${restaurant.id}'">
                    Order Now <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Load cuisine categories
 */
function loadCuisines() {
    const cuisines = [
        { name: 'Italian', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'American', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'Chinese', image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'Japanese', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'Mexican', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
    ];
    
    const grid = document.querySelector('.cuisine-grid');
    if (!grid) return;
    
    grid.innerHTML = cuisines.map(cuisine => `
        <div class="cuisine-card" onclick="filterByCuisine('${cuisine.name}')">
            <img src="${cuisine.image}" alt="${cuisine.name}" loading="lazy">
            <span>${cuisine.name}</span>
        </div>
    `).join('');
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const locationSelect = document.getElementById('location');
    
    if (!searchInput || !searchBtn) return;
    
    // Load saved location
    const savedLocation = localStorage.getItem('yumytummy_location');
    if (savedLocation && locationSelect) {
        locationSelect.value = savedLocation;
    }
    
    const performSearch = () => {
        const query = searchInput.value.trim();
        const location = locationSelect ? locationSelect.value : 'mumbai';
        
        if (query) {
            // Save location
            localStorage.setItem('yumytummy_location', location);
            
            Toast.info(`Searching for "${query}" in ${getLocationName(location)}`);
            
            // In a real app, this would redirect to search results
            setTimeout(() => {
                window.location.href = `search.html?q=${encodeURIComponent(query)}&location=${location}`;
            }, 1000);
        }
    };
    
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Popular search terms
    document.querySelectorAll('.popular-searches a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = link.textContent;
            performSearch();
        });
    });
}

/**
 * Get location name from value
 */
function getLocationName(value) {
    const locations = {
        'mumbai': 'Mumbai',
        'delhi': 'Delhi NCR',
        'bangalore': 'Bangalore',
        'chennai': 'Chennai',
        'kolkata': 'Kolkata',
        'pune': 'Pune',
        'hyderabad': 'Hyderabad',
        'ahmedabad': 'Ahmedabad',
        'jaipur': 'Jaipur',
        'lucknow': 'Lucknow'
    };
    return locations[value] || value;
}

/**
 * Initialize quick filters
 */
function initQuickFilters() {
    const filters = document.querySelectorAll('.filter-chip');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            filters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Animate
            this.style.animation = 'scaleIn 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
            
            // Get filter value
            const filterValue = this.textContent.trim();
            
            // Show toast
            Toast.info(`Filtering by: ${filterValue}`);
            
            // In a real app, this would filter the restaurants
            if (filterValue !== 'All') {
                filterRestaurants(filterValue);
            } else {
                resetFilters();
            }
        });
    });
}

/**
 * Filter restaurants (simulated)
 */
function filterRestaurants(filter) {
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    
    restaurantCards.forEach(card => {
        // Simulate filtering - in real app would check actual data
        if (Math.random() > 0.5) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Reset filters
 */
function resetFilters() {
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    
    restaurantCards.forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease';
    });
}

/**
 * Filter by cuisine
 */
function filterByCuisine(cuisine) {
    Toast.info(`Showing ${cuisine} restaurants`);
    
    // In a real app, this would redirect to filtered results
    setTimeout(() => {
        window.location.href = `search.html?cuisine=${encodeURIComponent(cuisine)}`;
    }, 1000);
}

/**
 * Initialize offer timer
 */
function initOfferTimer() {
    const timerItems = document.querySelectorAll('.timer-item');
    if (timerItems.length < 3) return;
    
    // Set end time to 2 hours from now
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 2);
    
    function updateTimer() {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            // Timer expired
            document.querySelector('.offer-timer').innerHTML = '<span>Offer expired!</span>';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timerItems[0].textContent = hours.toString().padStart(2, '0');
        timerItems[1].textContent = minutes.toString().padStart(2, '0');
        timerItems[2].textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update timer every second
    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * Load user preferences
 */
function loadUserPreferences() {
    const user = JSON.parse(localStorage.getItem('yumytummy_user'));
    
    if (user) {
        // Load favorite cuisine if saved
        const favCuisine = localStorage.getItem('yumytummy_fav_cuisine');
        if (favCuisine) {
            // Highlight favorite cuisine
            console.log(`User's favorite cuisine: ${favCuisine}`);
        }
    }
}

/**
 * Add to cart from home page
 */
function addToCartFromHome(food) {
    const item = {
        id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        restaurant: food.restaurant,
        restaurantId: food.restaurantId
    };
    
    addToCart(item);
    
    // Animate button
    const btn = event.currentTarget;
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    
    // Create floating animation
    createFloatingAnimation(btn, food.image);
    
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fas fa-plus"></i>';
    }, 1500);
}

/**
 * Create floating animation when adding to cart
 */
function createFloatingAnimation(btn, imageUrl) {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const btnRect = btn.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    const floatingImg = document.createElement('img');
    floatingImg.src = imageUrl;
    floatingImg.style.position = 'fixed';
    floatingImg.style.left = btnRect.left + 'px';
    floatingImg.style.top = btnRect.top + 'px';
    floatingImg.style.width = '50px';
    floatingImg.style.height = '50px';
    floatingImg.style.borderRadius = '50%';
    floatingImg.style.objectFit = 'cover';
    floatingImg.style.zIndex = '9999';
    floatingImg.style.transition = 'all 1s ease-in-out';
    floatingImg.style.pointerEvents = 'none';
    
    document.body.appendChild(floatingImg);
    
    // Animate to cart
    setTimeout(() => {
        floatingImg.style.left = cartRect.left + 'px';
        floatingImg.style.top = cartRect.top + 'px';
        floatingImg.style.width = '20px';
        floatingImg.style.height = '20px';
        floatingImg.style.opacity = '0.5';
    }, 50);
    
    // Remove after animation
    setTimeout(() => {
        floatingImg.remove();
    }, 1050);
}

// Make functions globally available
window.addToCartFromHome = addToCartFromHome;
window.filterByCuisine = filterByCuisine;