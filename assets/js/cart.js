/**
 * YumyTummy Cart Page JavaScript
 * Handles cart display, updates, and checkout
 */

// Coupon codes
const COUPONS = {
    'WELCOME50': { discount: 50, type: 'percentage', minOrder: 199 },
    'FIRST25': { discount: 25, type: 'fixed', minOrder: 299 },
    'FREEDEL': { discount: 49, type: 'delivery', minOrder: 299 },
    'SAVE20': { discount: 20, type: 'percentage', minOrder: 399 },
    'HUNGRY': { discount: 75, type: 'fixed', minOrder: 499 }
};

let currentCoupon = null;

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartItems();
    
    // Load saved items
    loadSavedItems();
    
    // Initialize event listeners
    initEventListeners();
});

/**
 * Load and display cart items
 */
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    const container = document.getElementById('cartItemsContainer');
    const cartActions = document.querySelector('.cart-actions');
    
    if (cart.length === 0) {
        displayEmptyCart();
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-product">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p><i class="fas fa-store"></i> ${item.restaurant}</p>
                </div>
            </div>
            <div class="cart-item-price">₹${item.price}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 'decrease')" ${item.quantity <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity || 1}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 'increase')">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-total">₹${(item.price * (item.quantity || 1)).toFixed(0)}</div>
            <button class="remove-item" onclick="removeItem(${item.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');
    
    updateCartSummary();
    
    if (cartActions) {
        cartActions.style.display = 'flex';
    }
}

/**
 * Display empty cart message
 */
function displayEmptyCart() {
    const container = document.getElementById('cartItemsContainer');
    const cartActions = document.querySelector('.cart-actions');
    const savedItems = document.querySelector('.saved-items');
    
    container.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-bag"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <a href="home.html" class="btn btn-primary">Browse Restaurants</a>
        </div>
    `;
    
    if (cartActions) {
        cartActions.style.display = 'none';
    }
    
    if (savedItems) {
        savedItems.style.display = 'none';
    }
}

/**
 * Load saved for later items
 */
function loadSavedItems() {
    const saved = JSON.parse(localStorage.getItem('yumytummy_saved')) || [];
    const container = document.getElementById('savedItemsContainer');
    const savedSection = document.querySelector('.saved-items');
    
    if (saved.length === 0) {
        if (savedSection) {
            savedSection.style.display = 'none';
        }
        return;
    }
    
    container.innerHTML = saved.map(item => `
        <div class="saved-item">
            <div class="saved-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="saved-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <div class="saved-item-actions">
                <button onclick="moveToCart(${item.id})" title="Add to cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button onclick="removeSaved(${item.id})" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Clear cart button
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
    
    // Apply coupon button
    document.getElementById('applyCouponBtn')?.addEventListener('click', applyCoupon);
    
    // Place order button
    document.getElementById('placeOrderBtn')?.addEventListener('click', placeOrder);
    
    // Coupon input enter key
    document.getElementById('couponInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyCoupon();
        }
    });
    
    // Coupon chips
    document.querySelectorAll('.coupon-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.getElementById('couponInput').value = this.textContent;
            applyCoupon();
        });
    });
}

/**
 * Update quantity of cart item
 */
function updateQuantity(itemId, action) {
    let cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    const itemIndex = cart.findIndex(item => item.id == itemId);
    
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        const currentQty = item.quantity || 1;
        
        if (action === 'increase') {
            item.quantity = currentQty + 1;
            animateQuantityChange('increase');
        } else if (action === 'decrease' && currentQty > 1) {
            item.quantity = currentQty - 1;
            animateQuantityChange('decrease');
        }
        
        localStorage.setItem('yumytummy_cart', JSON.stringify(cart));
        
        // Update display
        loadCartItems();
        updateCartCount();
    }
}

/**
 * Animate quantity change
 */
function animateQuantityChange(type) {
    const toast = document.createElement('div');
    toast.className = 'item-added-toast show';
    toast.innerHTML = `
        <i class="fas fa-${type === 'increase' ? 'plus' : 'minus'}-circle"></i>
        <span>Quantity ${type === 'increase' ? 'increased' : 'decreased'}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 1500);
}

/**
 * Remove item from cart
 */
function removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    
    // Ask if user wants to save for later
    if (confirm('Do you want to save this item for later?')) {
        const item = cart.find(item => item.id == itemId);
        saveForLater(item);
    }
    
    cart = cart.filter(item => item.id != itemId);
    
    localStorage.setItem('yumytummy_cart', JSON.stringify(cart));
    
    // Update display
    loadCartItems();
    updateCartCount();
    
    Toast.success('Item removed from cart');
}

/**
 * Save item for later
 */
function saveForLater(item) {
    let saved = JSON.parse(localStorage.getItem('yumytummy_saved')) || [];
    saved.push(item);
    localStorage.setItem('yumytummy_saved', JSON.stringify(saved));
}

/**
 * Move item from saved to cart
 */
function moveToCart(itemId) {
    let saved = JSON.parse(localStorage.getItem('yumytummy_saved')) || [];
    let cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    
    const itemIndex = saved.findIndex(item => item.id == itemId);
    if (itemIndex !== -1) {
        const item = saved[itemIndex];
        cart.push(item);
        saved.splice(itemIndex, 1);
        
        localStorage.setItem('yumytummy_cart', JSON.stringify(cart));
        localStorage.setItem('yumytummy_saved', JSON.stringify(saved));
        
        loadCartItems();
        loadSavedItems();
        updateCartCount();
        
        Toast.success('Item moved to cart');
    }
}

/**
 * Remove saved item
 */
function removeSaved(itemId) {
    let saved = JSON.parse(localStorage.getItem('yumytummy_saved')) || [];
    saved = saved.filter(item => item.id != itemId);
    localStorage.setItem('yumytummy_saved', JSON.stringify(saved));
    loadSavedItems();
}

/**
 * Clear entire cart
 */
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('yumytummy_cart');
        loadCartItems();
        updateCartCount();
        Toast.success('Cart cleared');
        
        // Reset coupon
        currentCoupon = null;
        document.getElementById('discountRow').style.display = 'none';
        document.getElementById('couponInput').value = '';
        document.getElementById('couponMessage').textContent = '';
    }
}

/**
 * Update cart summary
 */
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    
    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    // Delivery fee (free over ₹499)
    const deliveryFee = subtotal >= 499 ? 0 : 49;
    
    // Packaging fee
    const packagingFee = 10;
    
    // Calculate tax (5% GST)
    const taxableAmount = subtotal + packagingFee;
    const tax = taxableAmount * 0.05;
    
    // Calculate discount
    let discount = 0;
    if (currentCoupon && subtotal >= currentCoupon.minOrder) {
        if (currentCoupon.type === 'percentage') {
            discount = (subtotal * currentCoupon.discount) / 100;
        } else if (currentCoupon.type === 'fixed') {
            discount = currentCoupon.discount;
        } else if (currentCoupon.type === 'delivery') {
            discount = deliveryFee;
        }
        
        // Cap discount at subtotal
        discount = Math.min(discount, subtotal);
        
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountAmount').textContent = `-₹${discount.toFixed(0)}`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
    
    // Calculate total
    const total = subtotal + deliveryFee + packagingFee + tax - discount;
    
    // Update display
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(0)}`;
    document.getElementById('deliveryFee').textContent = deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`;
    document.getElementById('packagingFee').textContent = `₹${packagingFee}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(0)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(0)}`;
}

/**
 * Apply coupon code
 */
function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const couponMessage = document.getElementById('couponMessage');
    const code = couponInput.value.trim().toUpperCase();
    
    if (!code) {
        couponMessage.textContent = 'Please enter a coupon code';
        couponMessage.className = 'coupon-message error';
        return;
    }
    
    const coupon = COUPONS[code];
    
    if (!coupon) {
        couponMessage.textContent = 'Invalid coupon code';
        couponMessage.className = 'coupon-message error';
        currentCoupon = null;
        updateCartSummary();
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    if (subtotal < coupon.minOrder) {
        couponMessage.textContent = `Minimum order of ₹${coupon.minOrder} required for this coupon`;
        couponMessage.className = 'coupon-message error';
        currentCoupon = null;
        updateCartSummary();
        return;
    }
    
    currentCoupon = { code, ...coupon };
    couponMessage.textContent = 'Coupon applied successfully!';
    couponMessage.className = 'coupon-message success';
    
    updateCartSummary();
    Toast.success('Coupon applied!');
}

/**
 * Place order
 */
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    
    if (cart.length === 0) {
        Toast.warning('Your cart is empty');
        return;
    }
    
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('yumytummy_user'));
    if (!user) {
        Toast.warning('Please login to place order');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Save order summary for order page
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const deliveryFee = subtotal >= 499 ? 0 : 49;
    const packagingFee = 10;
    const tax = (subtotal + packagingFee) * 0.05;
    let discount = 0;
    
    if (currentCoupon && subtotal >= currentCoupon.minOrder) {
        if (currentCoupon.type === 'percentage') {
            discount = (subtotal * currentCoupon.discount) / 100;
        } else if (currentCoupon.type === 'fixed') {
            discount = currentCoupon.discount;
        } else if (currentCoupon.type === 'delivery') {
            discount = deliveryFee;
        }
    }
    
    const total = subtotal + deliveryFee + packagingFee + tax - discount;
    
    const orderSummary = {
        items: cart,
        subtotal,
        deliveryFee,
        packagingFee,
        tax,
        discount,
        total,
        coupon: currentCoupon?.code
    };
    
    localStorage.setItem('yumytummy_order_summary', JSON.stringify(orderSummary));
    
    // Redirect to order page
    window.location.href = 'order.html';
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.moveToCart = moveToCart;
window.removeSaved = removeSaved;