/**
 * YumyTummy Order Page JavaScript
 * Handles multi-step checkout process
 */

let currentStep = 1;
let orderData = {};

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    requireAuth();
    
    // Load order data
    loadOrderData();
    
    // Initialize step navigation
    initStepNavigation();
    
    // Load customer data if logged in
    loadCustomerData();
    
    // Initialize payment method switching
    initPaymentMethods();
    
    // Load order preview
    loadOrderPreview();
});

/**
 * Load order data from localStorage
 */
function loadOrderData() {
    const orderSummary = JSON.parse(localStorage.getItem('yumytummy_order_summary'));
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart'));
    
    if (!orderSummary && !cart) {
        Toast.error('No order found');
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1500);
        return;
    }
    
    orderData = {
        summary: orderSummary,
        cart: cart
    };
}

/**
 * Initialize step navigation
 */
function initStepNavigation() {
    // Step 1 to Step 2
    document.getElementById('toStep2Btn').addEventListener('click', validateAndGoToStep2);
    
    // Step 2 to Step 3
    document.getElementById('toStep3Btn').addEventListener('click', goToStep3);
    
    // Place final order
    document.getElementById('placeFinalOrderBtn').addEventListener('click', placeOrder);
}

/**
 * Load customer data from localStorage
 */
function loadCustomerData() {
    const user = JSON.parse(localStorage.getItem('yumytummy_user'));
    const savedAddress = JSON.parse(localStorage.getItem('yumytummy_address'));
    
    if (user) {
        document.getElementById('firstName').value = user.name?.split(' ')[0] || '';
        document.getElementById('lastName').value = user.name?.split(' ')[1] || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
    }
    
    if (savedAddress) {
        document.getElementById('address').value = savedAddress.address || '';
        document.getElementById('apartment').value = savedAddress.apartment || '';
        document.getElementById('city').value = savedAddress.city || '';
        document.getElementById('state').value = savedAddress.state || '';
        document.getElementById('zipCode').value = savedAddress.zipCode || '';
    }
}

/**
 * Load order preview in sidebar
 */
function loadOrderPreview() {
    const cart = orderData.cart || [];
    const summary = orderData.summary;
    
    // Load items preview
    const previewContainer = document.getElementById('orderItemsPreview');
    previewContainer.innerHTML = cart.map(item => `
        <div class="order-preview-item">
            <div class="preview-item-info">
                <span class="preview-item-quantity">${item.quantity}x</span>
                <span class="preview-item-name">${item.name}</span>
            </div>
            <span class="preview-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    // Update summary
    if (summary) {
        document.getElementById('previewSubtotal').textContent = `$${summary.subtotal.toFixed(2)}`;
        document.getElementById('previewDelivery').textContent = summary.deliveryFee === 0 ? 'Free' : `$${summary.deliveryFee.toFixed(2)}`;
        document.getElementById('previewTax').textContent = `$${summary.tax.toFixed(2)}`;
        document.getElementById('previewTotal').textContent = `$${summary.total.toFixed(2)}`;
        
        // Update all summary sections
        document.getElementById('summarySubtotal').textContent = `$${summary.subtotal.toFixed(2)}`;
        document.getElementById('summaryDelivery').textContent = summary.deliveryFee === 0 ? 'Free' : `$${summary.deliveryFee.toFixed(2)}`;
        document.getElementById('summaryTax').textContent = `$${summary.tax.toFixed(2)}`;
        document.getElementById('summaryTotal').textContent = `$${summary.total.toFixed(2)}`;
        document.getElementById('paymentTotal').textContent = `$${summary.total.toFixed(2)}`;
        
        if (summary.discount > 0) {
            document.getElementById('summaryDiscount').style.display = 'flex';
            document.getElementById('summaryDiscountAmount').textContent = `-$${summary.discount.toFixed(2)}`;
        }
    }
}

/**
 * Validate and go to step 2
 */
function validateAndGoToStep2() {
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value.trim();
    
    // Validate
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
        Toast.error('Please fill in all required fields');
        return;
    }
    
    if (!validateEmail(email)) {
        Toast.error('Please enter a valid email address');
        return;
    }
    
    if (!validatePhone(phone)) {
        Toast.error('Please enter a valid phone number');
        return;
    }
    
    if (!validateZipCode(zipCode)) {
        Toast.error('Please enter a valid ZIP code');
        return;
    }
    
    // Save address if checkbox is checked
    if (document.getElementById('saveAddress').checked) {
        const addressData = {
            address,
            apartment: document.getElementById('apartment').value.trim(),
            city,
            state,
            zipCode
        };
        localStorage.setItem('yumytummy_address', JSON.stringify(addressData));
    }
    
    // Update step 2 display
    displayDeliveryAddress();
    displayFullOrderItems();
    
    // Go to step 2
    goToStep(2);
}

/**
 * Validate email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone
 */
function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
}

/**
 * Validate ZIP code
 */
function validateZipCode(zip) {
    const re = /^\d{5}(-\d{4})?$/;
    return re.test(zip);
}

/**
 * Display delivery address in step 2
 */
function displayDeliveryAddress() {
    const addressDisplay = document.getElementById('deliveryAddressDisplay');
    const apartment = document.getElementById('apartment').value.trim();
    
    let addressHtml = `
        <p><strong>${document.getElementById('firstName').value} ${document.getElementById('lastName').value}</strong></p>
        <p>${document.getElementById('address').value}</p>
    `;
    
    if (apartment) {
        addressHtml += `<p>${apartment}</p>`;
    }
    
    addressHtml += `
        <p>${document.getElementById('city').value}, ${document.getElementById('state').value} ${document.getElementById('zipCode').value}</p>
        <p>Phone: ${document.getElementById('phone').value}</p>
    `;
    
    addressDisplay.innerHTML = addressHtml;
}

/**
 * Display full order items in step 2
 */
function displayFullOrderItems() {
    const cart = orderData.cart || [];
    const container = document.getElementById('orderItemsFull');
    
    container.innerHTML = cart.map(item => `
        <div class="order-full-item">
            <div class="order-full-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-full-item-details">
                <h4>${item.name}</h4>
                <p>${item.restaurant}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="order-full-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
    
    // Set estimated time based on time of day
    const hour = new Date().getHours();
    let time;
    if (hour < 11) {
        time = '25-30 minutes';
    } else if (hour < 14) {
        time = '35-40 minutes (lunch rush)';
    } else if (hour < 18) {
        time = '30-35 minutes';
    } else if (hour < 21) {
        time = '40-45 minutes (dinner rush)';
    } else {
        time = '35-40 minutes';
    }
    
    document.getElementById('estimatedTime').textContent = time;
}

/**
 * Initialize payment methods switching
 */
function initPaymentMethods() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment forms
            document.getElementById('cardPaymentForm').style.display = 'none';
            document.getElementById('upiPaymentForm').style.display = 'none';
            document.getElementById('codMessage').style.display = 'none';
            
            // Show selected payment form
            if (this.value === 'card') {
                document.getElementById('cardPaymentForm').style.display = 'block';
            } else if (this.value === 'upi') {
                document.getElementById('upiPaymentForm').style.display = 'block';
            } else if (this.value === 'cod') {
                document.getElementById('codMessage').style.display = 'block';
            }
        });
    });
}

/**
 * Go to specific step
 */
function goToStep(step) {
    // Update step indicators
    for (let i = 1; i <= 3; i++) {
        const stepElement = document.getElementById(`step${i}`);
        const contentElement = document.getElementById(`step${i}Content`);
        
        if (i < step) {
            stepElement.classList.add('completed');
            stepElement.classList.remove('active');
        } else if (i === step) {
            stepElement.classList.add('active');
            stepElement.classList.remove('completed');
            contentElement.classList.add('active');
        } else {
            stepElement.classList.remove('active', 'completed');
            contentElement.classList.remove('active');
        }
    }
    
    currentStep = step;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Go to step 3
 */
function goToStep3() {
    // Validate that we have all necessary data
    if (!orderData.cart || orderData.cart.length === 0) {
        Toast.error('No items in order');
        return;
    }
    
    goToStep(3);
}

/**
 * Place final order
 */
function placeOrder() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Validate payment details based on method
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const cardName = document.getElementById('cardName').value.trim();
        
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            Toast.error('Please fill in all card details');
            return;
        }
        
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            Toast.error('Please enter a valid card number');
            return;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            Toast.error('Please enter a valid expiry date (MM/YY)');
            return;
        }
        
        if (cvv.length !== 3) {
            Toast.error('Please enter a valid CVV');
            return;
        }
    } else if (paymentMethod === 'upi') {
        const upiId = document.getElementById('upiId').value.trim();
        if (!upiId || !upiId.includes('@')) {
            Toast.error('Please enter a valid UPI ID');
            return;
        }
    }
    
    // Show loading state
    const placeOrderBtn = document.getElementById('placeFinalOrderBtn');
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate order placement
    setTimeout(() => {
        // Create order object
        const order = {
            id: 'ORD' + Date.now(),
            date: new Date().toISOString(),
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            },
            address: {
                street: document.getElementById('address').value,
                apartment: document.getElementById('apartment').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value
            },
            items: orderData.cart,
            summary: orderData.summary,
            paymentMethod: paymentMethod,
            estimatedTime: document.getElementById('estimatedTime').textContent
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('yumytummy_orders')) || [];
        orders.push(order);
        localStorage.setItem('yumytummy_orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('yumytummy_cart');
        localStorage.removeItem('yumytummy_order_summary');
        
        // Save current order for success page
        localStorage.setItem('yumytummy_current_order', JSON.stringify(order));
        
        // Redirect to success page
        window.location.href = 'success.html';
    }, 2000);
}

// Make functions globally available
window.goToStep = goToStep;