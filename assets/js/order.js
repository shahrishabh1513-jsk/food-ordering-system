/**
 * YumyTummy Success Page JavaScript
 * Handles order confirmation display and tracking
 */

let trackingInterval;
let currentStep = 1; // 1: Preparing, 2: Out for Delivery, 3: Delivered

document.addEventListener('DOMContentLoaded', function() {
    // Load order data
    loadOrderData();
    
    // Initialize buttons
    initButtons();
    
    // Start tracking simulation
    startTrackingSimulation();
    
    // Load recommended items
    loadRecommendedItems();
    
    // Start progress animation
    startProgressAnimation();
});

/**
 * Load order data from localStorage
 */
function loadOrderData() {
    const order = JSON.parse(localStorage.getItem('yumytummy_current_order'));
    
    if (!order) {
        Toast.error('No order found');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
        return;
    }
    
    // Display order number
    document.getElementById('orderNumber').textContent = order.id;
    
    // Display order time
    const orderTime = new Date(order.date);
    document.getElementById('orderTime').textContent = formatTime(orderTime);
    document.getElementById('orderDate').textContent = formatDate(orderTime);
    
    // Display ETA
    document.getElementById('eta').textContent = order.estimatedTime || '30-40 minutes';
    
    // Display order items
    displayOrderItems(order.items);
    
    // Display order summary
    displayOrderSummary(order.summary, order.tip);
    
    // Display delivery address
    displayDeliveryAddress(order.address);
    
    // Display payment method
    displayPaymentMethod(order.paymentMethod);
}

/**
 * Format time for display
 */
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

/**
 * Format date for display
 */
function formatDate(date) {
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-IN', options);
}

/**
 * Display order items
 */
function displayOrderItems(items) {
    const container = document.getElementById('orderItems');
    
    if (!items || items.length === 0) {
        container.innerHTML = '<p>No items found</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="order-summary-item">
            <div class="item-info">
                <span class="item-quantity">${item.quantity}x</span>
                <span class="item-name">${item.name}</span>
            </div>
            <span class="item-price">₹${(item.price * item.quantity).toFixed(0)}</span>
        </div>
    `).join('');
}

/**
 * Display order summary
 */
function displayOrderSummary(summary, tip = 0) {
    if (!summary) return;
    
    document.getElementById('orderSubtotal').textContent = `₹${summary.subtotal.toFixed(0)}`;
    document.getElementById('orderDelivery').textContent = summary.deliveryFee === 0 ? 'Free' : `₹${summary.deliveryFee}`;
    document.getElementById('orderPackaging').textContent = `₹${summary.packagingFee}`;
    document.getElementById('orderTax').textContent = `₹${summary.tax.toFixed(0)}`;
    
    const total = summary.total + (tip || 0);
    document.getElementById('orderTotal').textContent = `₹${total.toFixed(0)}`;
}

/**
 * Display delivery address
 */
function displayDeliveryAddress(address) {
    if (!address) return;
    
    let addressHtml = '';
    
    if (address.type) {
        addressHtml += `<p><strong>${address.type}</strong></p>`;
    }
    
    addressHtml += `<p>${address.street}</p>`;
    
    if (address.apartment) {
        addressHtml += `<p>${address.apartment}</p>`;
    }
    
    addressHtml += `<p>${address.city} - ${address.zipCode}</p>`;
    
    document.getElementById('deliveryAddress').innerHTML = addressHtml;
}

/**
 * Display payment method
 */
function displayPaymentMethod(method) {
    const paymentMap = {
        'card': 'Credit/Debit Card',
        'upi': 'UPI',
        'netbanking': 'Net Banking',
        'wallet': 'Wallet',
        'cod': 'Cash on Delivery'
    };
    
    document.getElementById('paymentMethod').textContent = paymentMap[method] || method;
}

/**
 * Initialize buttons
 */
function initButtons() {
    // Track order button
    document.getElementById('trackOrderBtn').addEventListener('click', function() {
        Toast.info('Opening live tracking...');
        // In a real app, this would open a map view
    });
    
    // Print bill button
    document.getElementById('printBillBtn').addEventListener('click', printBill);
    
    // Call partner button
    document.getElementById('callPartner').addEventListener('click', function() {
        Toast.info('Calling delivery partner...');
        // In real app, this would initiate a phone call
    });
    
    // Message partner button
    document.getElementById('messagePartner').addEventListener('click', function() {
        Toast.info('Opening chat...');
    });
    
    // Share location button
    document.getElementById('shareLocation').addEventListener('click', function() {
        Toast.info('Sharing live location...');
    });
    
    // Reorder button
    document.getElementById('reorderBtn').addEventListener('click', reorderItems);
}

/**
 * Print bill
 */
function printBill() {
    window.print();
}

/**
 * Reorder same items
 */
function reorderItems() {
    const order = JSON.parse(localStorage.getItem('yumytummy_current_order'));
    
    if (order && order.items) {
        localStorage.setItem('yumytummy_cart', JSON.stringify(order.items));
        Toast.success('Items added to cart!');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
    }
}

/**
 * Start tracking simulation
 */
function startTrackingSimulation() {
    // Update every 2 minutes in real app, but for demo use shorter intervals
    trackingInterval = setInterval(() => {
        currentStep++;
        
        if (currentStep === 2) {
            // Move to "Out for Delivery"
            updateTimelineStep(2);
            updateOrderStatus('Out for Delivery');
            updateETA('15-20 minutes');
            updateProgressBar(50);
            
            Toast.info('Your order is out for delivery!');
            
            // Update delivery marker position
            updateDeliveryMarker(50);
            
        } else if (currentStep === 3) {
            // Move to "Delivered"
            updateTimelineStep(3);
            updateOrderStatus('Delivered');
            updateETA('Delivered');
            updateProgressBar(100);
            
            Toast.success('Your order has been delivered! Enjoy your meal!');
            
            // Update delivery marker position
            updateDeliveryMarker(100);
            
            // Clear interval
            clearInterval(trackingInterval);
            
            // Show review prompt
            setTimeout(() => {
                if (confirm('How was your meal? Would you like to leave a review?')) {
                    window.location.href = 'review.html';
                }
            }, 3000);
        }
    }, 10000); // 10 seconds for demo (in real app would be 2 minutes)
}

/**
 * Update timeline step
 */
function updateTimelineStep(step) {
    const steps = document.querySelectorAll('.timeline-step');
    
    steps.forEach((s, index) => {
        s.classList.remove('active', 'completed');
        
        if (index < step) {
            s.classList.add('completed');
        } else if (index === step) {
            s.classList.add('active');
        }
    });
}

/**
 * Update order status
 */
function updateOrderStatus(status) {
    const statusElement = document.querySelector('.order-status');
    if (statusElement) {
        statusElement.textContent = status;
        
        if (status === 'Delivered') {
            statusElement.style.background = 'var(--success)';
        }
    }
}

/**
 * Update ETA
 */
function updateETA(eta) {
    const etaElement = document.getElementById('eta');
    if (etaElement) {
        etaElement.textContent = eta;
    }
}

/**
 * Update progress bar
 */
function updateProgressBar(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
}

/**
 * Update delivery marker position
 */
function updateDeliveryMarker(percentage) {
    const marker = document.querySelector('.delivery-marker');
    const path = document.querySelector('.delivery-path');
    
    if (marker && path) {
        const pathWidth = path.offsetWidth;
        const moveDistance = (pathWidth * percentage) / 100;
        marker.style.transform = `translateX(${moveDistance}px)`;
    }
}

/**
 * Start progress animation
 */
function startProgressAnimation() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.transition = 'width 30s linear';
        progressBar.style.width = '25%';
    }
}

/**
 * Load recommended items
 */
function loadRecommendedItems() {
    const recommended = [
        {
            id: 101,
            name: 'Margherita Pizza',
            price: 399,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        },
        {
            id: 102,
            name: 'Classic Burger',
            price: 299,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        },
        {
            id: 103,
            name: 'Chicken Biryani',
            price: 349,
            image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        },
        {
            id: 104,
            name: 'Garlic Bread',
            price: 149,
            image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        }
    ];
    
    const container = document.getElementById('recommendedGrid');
    if (!container) return;
    
    container.innerHTML = recommended.map(item => `
        <div class="recommended-item" onclick="addToCartFromRecommend(${item.id}, '${item.name}', ${item.price}, '${item.image}')">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="recommended-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Add to cart from recommended
 */
function addToCartFromRecommend(id, name, price, image) {
    const item = {
        id,
        name,
        price,
        image,
        restaurant: 'Recommended',
        quantity: 1
    };
    
    addToCart(item);
}

// Clean up interval on page unload
window.addEventListener('beforeunload', function() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
});

// Make functions globally available
window.addToCartFromRecommend = addToCartFromRecommend;