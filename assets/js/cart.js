/**
 * YumyTummy Cart Page JavaScript
 * Handles cart display, updates, and checkout
 */

// Coupon codes
const COUPONS = {
    'YUMMY50': { discount: 50, type: 'percentage', minOrder: 20 },
    'SAVE20': { discount: 20, type: 'fixed', minOrder: 30 },
    'FREEDEL': { discount: 2.99, type: 'delivery', minOrder: 25 }
};

let currentCoupon = null;

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartItems();
    
    // Initialize event listeners
    initEventListeners();
});

/**
 * Load and display cart items
 */
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    const container = document.getElementById('cartItemsContainer');
    
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
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 'decrease')" ${item.quantity <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity || 1}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 'increase')">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-total">$${(item.price * (item.quantity || 1)).toFixed(2)}</div>
            <button class="remove-item" onclick="removeItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateCartSummary();
}

/**
 * Display empty cart message
 */
function displayEmptyCart() {
    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-bag"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <a href="menu.html" class="btn btn-primary">Browse Menu</a>
        </div>
    `;
    
    // Hide cart actions
    document.querySelector('.cart-actions').style.display = 'none';
    
    // Update summary
    updateCartSummary();
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
}

/**
 * Update quantity of cart item
 */
function updateQuantity(itemId, action) {
    let cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        const currentQty = item.quantity || 1;
        
        if (action === 'increase') {
            item.quantity = currentQty + 1;
        } else if (action === 'decrease' && currentQty > 1) {
            item.quantity = currentQty - 1;
        }
        
        localStorage.setItem('yumytummy_cart', JSON.stringify(cart));
        
        // Update display
        loadCartItems();
        updateCartCount();
        
        // Show toast notification
        Toast.success('Cart updated');
    }
}

/**
 * Remove item from cart
 */
function removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('yumytummy_cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('yumytummy_cart', JSON.stringify(cart));
    
    // Update display
    loadCartItems();
    updateCartCount();
    
    // Show toast notification
    Toast.success('Item removed from cart');
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
    
    // Delivery fee (free over $50)
    const deliveryFee = subtotal >= 50 ? 0 : 2.99;
    
    // Calculate tax (8%)
    const tax = subtotal * 0.08;
    
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
        document.getElementById('discountAmount').textContent = `-$${discount.toFixed(2)}`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
    
    // Calculate total
    const total = subtotal + deliveryFee + tax - discount;
    
    // Update display
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
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
        couponMessage.textContent = `Minimum order of $${coupon.minOrder} required for this coupon`;
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
    const deliveryFee = subtotal >= 50 ? 0 : 2.99;
    const tax = subtotal * 0.08;
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
    
    const total = subtotal + deliveryFee + tax - discount;
    
    const orderSummary = {
        items: cart,
        subtotal,
        deliveryFee,
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