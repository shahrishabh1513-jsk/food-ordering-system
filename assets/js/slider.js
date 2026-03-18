/**
 * YumyTummy Slider JavaScript
 * Handles brand slider functionality
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
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 300;
    
    // Manual navigation
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Auto scroll
    let autoScrollInterval;
    
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
                // Reached the end, scroll back to start
                slider.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                slider.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 3000);
    };
    
    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };
    
    // Start auto scroll
    startAutoScroll();
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('mouseleave', startAutoScroll);
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoScroll();
    }, { passive: true });
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - scroll right
                slider.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                // Swipe right - scroll left
                slider.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    };
}    