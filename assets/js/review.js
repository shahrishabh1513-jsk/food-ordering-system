/**
 * YumyTummy Review Page JavaScript
 * Handles review submission and display
 */

// Sample recent reviews
const sampleReviews = [
    {
        user: 'Sarah Johnson',
        rating: 5,
        text: 'Amazing food! The pizza was delicious and delivery was super fast. Will definitely order again!',
        date: '2 hours ago'
    },
    {
        user: 'Michael Chen',
        rating: 4,
        text: 'Good quality food, portion sizes are generous. Slightly delayed delivery but overall great experience.',
        date: '5 hours ago'
    },
    {
        user: 'Emily Davis',
        rating: 5,
        text: 'Best Italian food in town! The pasta was cooked perfectly and the garlic bread was amazing.',
        date: '1 day ago'
    },
    {
        user: 'David Wilson',
        rating: 4,
        text: 'Very tasty food, reasonable prices. The packaging was excellent and food was still hot.',
        date: '2 days ago'
    }
];

let selectedPhotos = [];

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    requireAuth();
    
    // Load order items
    loadOrderItems();
    
    // Load recent reviews
    loadRecentReviews();
    
    // Initialize star ratings
    initStarRatings();
    
    // Initialize photo upload
    initPhotoUpload();
    
    // Handle form submission
    initReviewForm();
});

/**
 * Load order items for review
 */
function loadOrderItems() {
    const order = JSON.parse(localStorage.getItem('yumytummy_current_order'));
    const cart = JSON.parse(localStorage.getItem('yumytummy_cart'));
    
    const items = order?.items || cart || [];
    const container = document.getElementById('reviewOrderItems');
    
    if (items.length === 0) {
        container.innerHTML = '<p>No items to review</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="review-order-item">
            <div class="review-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="review-item-details">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Load recent reviews
 */
function loadRecentReviews() {
    const container = document.getElementById('recentReviews');
    
    container.innerHTML = sampleReviews.map(review => `
        <div class="recent-review-item">
            <div class="recent-review-header">
                <span class="recent-review-user">${review.user}</span>
                <span class="recent-review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
            </div>
            <p class="recent-review-text">${review.text}</p>
            <span class="recent-review-date">${review.date}</span>
        </div>
    `).join('');
}

/**
 * Initialize star ratings
 */
function initStarRatings() {
    const ratingContainers = ['overallRating', 'foodRating', 'deliveryRating'];
    
    ratingContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        const stars = container.querySelectorAll('i');
        
        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                highlightStars(container, rating);
            });
            
            star.addEventListener('mouseleave', function() {
                const currentRating = containerId === 'overallRating' 
                    ? parseInt(document.getElementById('ratingValue').value)
                    : 0;
                highlightStars(container, currentRating);
            });
            
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                
                if (containerId === 'overallRating') {
                    document.getElementById('ratingValue').value = rating;
                }
                
                setRating(container, rating);
            });
        });
    });
}

/**
 * Highlight stars up to given rating
 */
function highlightStars(container, rating) {
    const stars = container.querySelectorAll('i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

/**
 * Set rating for a container
 */
function setRating(container, rating) {
    const stars = container.querySelectorAll('i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star active';
        } else {
            star.className = 'far fa-star';
        }
    });
}

/**
 * Initialize photo upload
 */
function initPhotoUpload() {
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    
    photoInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    selectedPhotos.push(e.target.result);
                    displayPhotoPreviews();
                };
                
                reader.readAsDataURL(file);
            }
        });
    });
}

/**
 * Display photo previews
 */
function displayPhotoPreviews() {
    const preview = document.getElementById('photoPreview');
    
    preview.innerHTML = selectedPhotos.map((photo, index) => `
        <div class="preview-image">
            <img src="${photo}" alt="Preview">
            <div class="remove-photo" onclick="removePhoto(${index})">
                <i class="fas fa-times"></i>
            </div>
        </div>
    `).join('');
}

/**
 * Remove photo from preview
 */
function removePhoto(index) {
    selectedPhotos.splice(index, 1);
    displayPhotoPreviews();
}

/**
 * Initialize review form submission
 */
function initReviewForm() {
    const form = document.getElementById('reviewForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const overallRating = parseInt(document.getElementById('ratingValue').value);
        const title = document.getElementById('reviewTitle').value.trim();
        const content = document.getElementById('reviewContent').value.trim();
        const recommend = document.getElementById('recommend').checked;
        
        // Validate
        if (overallRating === 0) {
            Toast.error('Please provide an overall rating');
            return;
        }
        
        if (!title) {
            Toast.error('Please enter a review title');
            return;
        }
        
        if (!content) {
            Toast.error('Please enter your review');
            return;
        }
        
        // Get food and delivery ratings
        const foodRating = getRating('foodRating');
        const deliveryRating = getRating('deliveryRating');
        
        // Create review object
        const review = {
            id: 'REV' + Date.now(),
            overallRating,
            foodRating,
            deliveryRating,
            title,
            content,
            recommend,
            photos: selectedPhotos,
            date: new Date().toISOString(),
            user: JSON.parse(localStorage.getItem('yumytummy_user'))?.name || 'Anonymous'
        };
        
        // Save review
        saveReview(review);
        
        // Show success message
        showSuccessMessage();
    });
}

/**
 * Get rating from a rating container
 */
function getRating(containerId) {
    const container = document.getElementById(containerId);
    const stars = container.querySelectorAll('.fas.fa-star');
    return stars.length;
}

/**
 * Save review to localStorage
 */
function saveReview(review) {
    const reviews = JSON.parse(localStorage.getItem('yumytummy_reviews')) || [];
    reviews.push(review);
    localStorage.setItem('yumytummy_reviews', JSON.stringify(reviews));
}

/**
 * Show success message after submission
 */
function showSuccessMessage() {
    const reviewCard = document.querySelector('.review-card');
    
    reviewCard.innerHTML = `
        <div class="review-success">
            <i class="fas fa-check-circle"></i>
            <h3>Thank You for Your Review!</h3>
            <p>Your feedback helps us improve and serve you better.</p>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="window.location.href='home.html'">
                    Go to Home
                </button>
                <button class="btn btn-outline" onclick="window.location.href='menu.html'">
                    Order Again
                </button>
            </div>
        </div>
    `;
}

// Make functions globally available
window.removePhoto = removePhoto;