/**
 * YumyTummy Slider JavaScript
 * Handles brand slider with auto-scroll functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initBrandSlider();
});

/**
 * Initialize brand slider with auto-scroll
 */
function initBrandSlider() {
    const slider = document.getElementById('brandSlider');
    const prevBtn = document.getElementById('brandPrev');
    const nextBtn = document.getElementById('brandNext');
    
    if (!slider) return;
    
    // Duplicate items for infinite scroll effect
    duplicateItems(slider);
    
    let scrollPosition = 0;
    const scrollAmount = 220; // Width of brand card + gap
    let autoScrollInterval;
    let isPaused = false;
    
    // Start auto scroll
    startAutoScroll();
    
    // Manual navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            scrollPosition = Math.max(0, scrollPosition - scrollAmount);
            smoothScroll(slider, scrollPosition);
            setTimeout(startAutoScroll, 5000); // Resume after 5 seconds
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            scrollPosition = Math.min(slider.scrollWidth - slider.clientWidth, scrollPosition + scrollAmount);
            smoothScroll(slider, scrollPosition);
            setTimeout(startAutoScroll, 5000); // Resume after 5 seconds
        });
    }
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        isPaused = true;
        stopAutoScroll();
    });
    
    slider.addEventListener('mouseleave', () => {
        isPaused = false;
        startAutoScroll();
    });
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        setTimeout(startAutoScroll, 5000);
    }, { passive: true });
    
    /**
     * Handle swipe gesture
     */
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - scroll right
                scrollPosition = Math.min(slider.scrollWidth - slider.clientWidth, scrollPosition + scrollAmount);
            } else {
                // Swipe right - scroll left
                scrollPosition = Math.max(0, scrollPosition - scrollAmount);
            }
            smoothScroll(slider, scrollPosition);
        }
    }
    
    /**
     * Start auto-scroll
     */
    function startAutoScroll() {
        if (autoScrollInterval || isPaused) return;
        
        autoScrollInterval = setInterval(() => {
            // Check if we're near the end
            if (scrollPosition >= slider.scrollWidth / 2 - slider.clientWidth) {
                // Jump back to start (infinite loop effect)
                scrollPosition = 0;
                slider.scrollTo({
                    left: scrollPosition,
                    behavior: 'auto'
                });
            } else {
                scrollPosition += scrollAmount;
                smoothScroll(slider, scrollPosition);
            }
        }, 3000);
    }
    
    /**
     * Stop auto-scroll
     */
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
    
    /**
     * Smooth scroll to position
     */
    function smoothScroll(element, position) {
        element.scrollTo({
            left: position,
            behavior: 'smooth'
        });
    }
    
    /**
     * Duplicate items for infinite scroll effect
     */
    function duplicateItems(slider) {
        const items = slider.children;
        if (items.length === 0) return;
        
        // Clone all items
        const itemsArray = Array.from(items);
        itemsArray.forEach(item => {
            const clone = item.cloneNode(true);
            slider.appendChild(clone);
        });
    }
}

/**
 * Initialize testimonial slider (if exists)
 */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    let currentSlide = 0;
    const slides = slider.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (slides.length === 0) return;
    
    // Show first slide
    showSlide(0);
    
    // Auto slide
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }
    
    // Dots navigation
    if (dots) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetAutoSlide();
            });
        });
    }
    
    /**
     * Show specific slide
     */
    function showSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            slide.style.animation = i === index ? 'fadeIn 0.5s ease' : '';
        });
        
        if (dots) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        currentSlide = index;
    }
    
    /**
     * Go to next slide
     */
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    /**
     * Go to previous slide
     */
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    /**
     * Reset auto slide timer
     */
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
}

// Initialize all sliders
document.addEventListener('DOMContentLoaded', function() {
    initBrandSlider();
    initTestimonialSlider();
});