/**
 * YumyTummy Menu Page JavaScript
 * Handles menu display, filtering, and cart interactions
 */

// Menu data
const menuData = {
    restaurant: {
        id: 1,
        name: 'Pizza Paradise',
        cuisine: 'Italian, Pizza',
        rating: 4.5,
        time: '25-30',
        price: '$$',
        offer: '50% OFF up to ₹100',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    categories: [
        { id: 1, name: 'Popular', count: 8 },
        { id: 2, name: 'Pizzas', count: 12 },
        { id: 3, name: 'Pastas', count: 6 },
        { id: 4, name: 'Appetizers', count: 8 },
        { id: 5, name: 'Salads', count: 5 },
        { id: 6, name: 'Desserts', count: 4 },
        { id: 7, name: 'Beverages', count: 6 }
    ],
    items: [
        {
            id: 1,
            name: 'Margherita Pizza',
            description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
            price: 14.99,
            rating: 4.5,
            category: 'Pizzas',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Best Seller',
            popular: true
        },
        {
            id: 2,
            name: 'Pepperoni Pizza',
            description: 'Loaded with pepperoni and extra cheese',
            price: 16.99,
            rating: 4.7,
            category: 'Pizzas',
            image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Spicy',
            popular: true
        },
        {
            id: 3,
            name: 'Fettuccine Alfredo',
            description: 'Creamy alfredo sauce with parmesan cheese',
            price: 13.99,
            rating: 4.4,
            category: 'Pastas',
            image: 'https://images.unsplash.com/photo-1645112411342-4665a10a9c76?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Creamy',
            popular: false
        },
        {
            id: 4,
            name: 'Garlic Breadsticks',
            description: 'Freshly baked breadsticks with garlic butter',
            price: 5.99,
            rating: 4.3,
            category: 'Appetizers',
            image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: '',
            popular: true
        },
        {
            id: 5,
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce with caesar dressing and croutons',
            price: 8.99,
            rating: 4.2,
            category: 'Salads',
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Healthy',
            popular: false
        },
        {
            id: 6,
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee and mascarpone',
            price: 7.99,
            rating: 4.8,
            category: 'Desserts',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Chef\'s Special',
            popular: true
        },
        {
            id: 7,
            name: 'Mango Lassi',
            description: 'Sweet yogurt drink with fresh mango pulp',
            price: 4.99,
            rating: 4.5,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1626200419069-f571501a3ea3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Refreshing',
            popular: false
        },
        {
            id: 8,
            name: 'BBQ Chicken Pizza',
            description: 'Grilled chicken with BBQ sauce and red onions',
            price: 17.99,
            rating: 4.6,
            category: 'Pizzas',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Signature',
            popular: true
        },
        {
            id: 9,
            name: 'Mushroom Risotto',
            description: 'Creamy arborio rice with wild mushrooms',
            price: 15.99,
            rating: 4.4,
            category: 'Pastas',
            image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Vegetarian',
            popular: false
        }
    ]
};

let currentCategory = 'all';
let currentSort = 'popular';
let searchQuery = '';
let displayedItems = 6;
let filteredItems = [];

document.addEventListener('DOMContentLoaded', function() {
    // Load restaurant info
    loadRestaurantInfo();
    
    // Load categories
    loadCategories();
    
    // Load menu items
    loadMenuItems();
    
    // Initialize filters
    initFilters();
    
    // Initialize cart sidebar
    initCartSidebar();
    
    // Check URL parameters
    checkUrlParams();
});

/**
 * Load restaurant information
 */
function loadRestaurantInfo() {
    // Check if restaurant ID is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurant');
    
    // In a real app, you'd fetch restaurant data based on ID
    // For now, we'll use the static data
    
    document.getElementById('restaurantName').textContent = menuData.restaurant.name;
    document.getElementById('restaurantRating').textContent = menuData.restaurant.rating;
    document.getElementById('restaurantCuisine').textContent = menuData.restaurant.cuisine;
    document.getElementById('restaurantTime').textContent = menuData.restaurant.time;
    document.getElementById('restaurantPrice').textContent = menuData.restaurant.price;
    document.getElementById('restaurantOffer').innerHTML = `<i class="fas fa-gift"></i> ${menuData.restaurant.offer}`;
}

/**
 * Load categories
 */
function loadCategories() {
    const categoryList = document.getElementById('categoryList');
    
    categoryList.innerHTML = `
        <li class="category-item">
            <a class="category-link active" data-category="all">
                All Items
                <span class="count">${menuData.items.length}</span>
            </a>
        </li>
    ` + menuData.categories.map(cat => `
        <li class="category-item">
            <a class="category-link" data-category="${cat.name.toLowerCase()}">
                ${cat.name}
                <span class="count">${cat.count}</span>
            </a>
        </li>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            displayedItems = 6;
            filterAndDisplayItems();
        });
    });
}

/**
 * Load menu items
 */
function loadMenuItems() {
    filteredItems = [...menuData.items];
    displayMenuItems();
}

/**
 * Display menu items
 */
function displayMenuItems() {
    const menuGrid = document.getElementById('menuGrid');
    const itemsToShow = filteredItems.slice(0, displayedItems);
    
    if (itemsToShow.length === 0) {
        menuGrid.innerHTML = `
            <div class="no-items">
                <i class="fas fa-search"></i>
                <h3>No items found</h3>
                <p>Try adjusting your search or filter</p>
            </div>
        `;
        return;
    }
    
    menuGrid.innerHTML = itemsToShow.map(item => `
        <div class="menu-item" data-id="${item.id}" data-category="${item.category.toLowerCase()}">
            ${item.badge ? `<span class="menu-item-badge">${item.badge}</span>` : ''}
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <span class="menu-item-rating">
                        <i class="fas fa-star"></i> ${item.rating}
                    </span>
                </div>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCartFromMenu(${item.id}, '${item.name}', ${item.price}, '${item.image}', '${menuData.restaurant.name}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (displayedItems >= filteredItems.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
}

/**
 * Initialize filters
 */
function initFilters() {
    // Search input
    const searchInput = document.getElementById('menuSearch');
    searchInput.addEventListener('input', debounce(function(e) {
        searchQuery = e.target.value.toLowerCase();
        displayedItems = 6;
        filterAndDisplayItems();
    }, 300));
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    sortFilter.addEventListener('change', function(e) {
        currentSort = e.target.value;
        filterAndDisplayItems();
    });
    
    // Load more button
    document.getElementById('loadMoreBtn').addEventListener('click', function() {
        displayedItems += 6;
        displayMenuItems();
    });
    
    // Filter button (for mobile)
    document.getElementById('filterBtn').addEventListener('click', function() {
        // In a real app, you might show a modal with additional filters
        Toast.info('Additional filters coming soon!');
    });
}

/**
 * Filter and display items based on current filters
 */
function filterAndDisplayItems() {
    // Start with all items
    let items = [...menuData.items];
    
    // Filter by category
    if (currentCategory !== 'all') {
        items = items.filter(item => item.category.toLowerCase() === currentCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(searchQuery) ||
            item.description.toLowerCase().includes(searchQuery)
        );
    }
    
    // Sort items
    switch(currentSort) {
        case 'price-low':
            items.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            items.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            items.sort((a, b) => b.rating - a.rating);
            break;
        default: // popular
            items.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }
    
    filteredItems = items;
    displayMenuItems();
}

/**
 * Add to cart from menu
 */
function addToCartFromMenu(id, name, price, image, restaurant) {
    const item = {
        id,
        name,
        price,
        image,
        restaurant
    };
    
    addToCart(item);
    
    // Animate button
    const btn = event.currentTarget;
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fas fa-plus"></i>';
    }, 1500);
    
    // Update cart sidebar
    updateCartSidebar();
}

/**
 * Initialize cart sidebar
 */
function initCartSidebar() {
    const floatingCart = document.getElementById('floatingCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    floatingCart.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        updateCartSidebar();
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !floatingCart.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });
}

/**
 * Update cart sidebar
 */
function updateCartSidebar() {
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    const sidebarItems = document.getElementById('cartSidebarItems');
    const sidebarTotal = document.getElementById('sidebarTotal');
    
    if (cart.length === 0) {
        sidebarItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <small>Add items from the menu</small>
            </div>
        `;
        sidebarTotal.textContent = '$0.00';
        return;
    }
    
    sidebarItems.innerHTML = cart.map(item => `
        <div class="cart-sidebar-item">
            <div class="cart-sidebar-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-sidebar-item-details">
                <h4>${item.name}</h4>
                <div class="cart-sidebar-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-sidebar-item-quantity">
                    <button onclick="updateCartItemQuantity(${item.id}, 'decrease')">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity || 1}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, 'increase')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    sidebarTotal.textContent = `$${total.toFixed(2)}`;
}

/**
 * Update cart item quantity
 */
function updateCartItemQuantity(itemId, action) {
    let cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + 1;
        } else if (action === 'decrease') {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
                Toast.info('Item removed from cart');
            }
        }
    }
    
    localStorage.setItem('yumytummy_cart', JSON.stringify(cart));
    updateCartCount();
    updateCartSidebar();
}

/**
 * Check URL parameters
 */
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
        document.getElementById('menuSearch').value = searchParam;
        searchQuery = searchParam.toLowerCase();
        filterAndDisplayItems();
    }
}

/**
 * Debounce function for search
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions globally available
window.addToCartFromMenu = addToCartFromMenu;
window.updateCartItemQuantity = updateCartItemQuantity;