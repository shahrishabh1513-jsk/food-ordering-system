/**
 * YumyTummy Success Page JavaScript
 * Handles order confirmation display and tracking
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load order data
    loadOrderData();
    
    // Initialize buttons
    initButtons();
    
    // Start tracking simulation
    startTrackingSimulation();
});

/**
 * Load order data from localStorage
 */
function loadOrderData() {
    const order = JSON.parse(localStorage.getItem('yumytummy_current_order'));
    
    if (!order) {
        Toast.error('No order found');
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1500);
        return;
    }
    
    // Display order number
    document.getElementById('orderNumber').textContent = order.id;
    
    // Display order time
    const orderTime = new Date(order.date);
    document.getElementById('orderTime').textContent = formatTime(orderTime);
    
    // Display ETA
    document.getElementById('eta').textContent = order.estimatedTime || '30-40 minutes';
    
    // Display order items
    displayOrderItems(order.items);
    
    // Display order summary
    displayOrderSummary(order.summary);
    
    // Display delivery address
    displayDeliveryAddress(order.address);
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
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}

/**
 * Display order summary
 */
function displayOrderSummary(summary) {
    if (!summary) return;
    
    document.getElementById('orderSubtotal').textContent = `$${summary.subtotal.toFixed(2)}`;
    document.getElementById('orderDelivery').textContent = summary.deliveryFee === 0 ? 'Free' : `$${summary.deliveryFee.toFixed(2)}`;
    document.getElementById('orderTax').textContent = `$${summary.tax.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `$${summary.total.toFixed(2)}`;
}

/**
 * Display delivery address
 */
function displayDeliveryAddress(address) {
    if (!address) return;
    
    const addressHtml = `
        ${address.street}<br>
        ${address.apartment ? address.apartment + '<br>' : ''}
        ${address.city}, ${address.state} ${address.zipCode}
    `;
    
    document.getElementById('deliveryAddress').innerHTML = addressHtml;
}

/**
 * Initialize buttons
 */
function initButtons() {
    // Track order button
    document.getElementById('trackOrderBtn').addEventListener('click', function() {
        Toast.info('Tracking feature coming soon!');
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
        Toast.info('Messaging feature coming soon!');
    });
}

/**
 * Print bill
 */
function printBill() {
    window.print();
}

/**
 * Start tracking simulation
 */
function startTrackingSimulation() {
    let currentStep = 1; // 1: Preparing, 2: Out for Delivery, 3: Delivered
    
    // Update status every 2 minutes (simulated)
    const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep === 2) {
            // Move to "Out for Delivery"
            updateTimelineStep(2);
            updateOrderStatus('Out for Delivery');
            updateETA('15-20 minutes');
            
            Toast.info('Your order is out for delivery!');
        } else if (currentStep === 3) {
            // Move to "Delivered"
            updateTimelineStep(3);
            updateOrderStatus('Delivered');
            updateETA('Delivered');
            
            Toast.success('Your order has been delivered! Enjoy your meal!');
            clearInterval(interval);
            
            // Show review prompt after 30 seconds
            setTimeout(() => {
                if (confirm('How was your meal? Would you like to leave a review?')) {
                    window.location.href = 'review.html';
                }
            }, 30000);
        }
    }, 120000); // 2 minutes in milliseconds (for demo purposes, you might want to use shorter intervals)
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