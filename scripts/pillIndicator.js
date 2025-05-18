/**
 * Controls the mouse-shaped scroll indicator with bobbing dot in the top right
 */

export const loadPillIndicator = () => {
    const mouseIndicator = document.getElementById('pill-indicator');
    const mouseDot = mouseIndicator?.querySelector('.pill-dot');
    
    if (!mouseIndicator || !mouseDot) {
        console.warn('Mouse indicator elements not found');
        return;
    }
    
    // Start the bobbing animation
    mouseDot.classList.add('bobbing');
    
    // Function to update dot position based on scroll
    const updateScrollPosition = () => {
        // Calculate total scrollable height
        const scrollHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const maxScroll = scrollHeight - viewportHeight;
        
        // Calculate scroll percentage (0 to 1)
        const scrollPercentage = window.scrollY / maxScroll;
        
        // Calculate dot position within mouse bounds
        const mouseHeight = mouseIndicator.offsetHeight;
        const dotHeight = mouseDot.offsetHeight;
        const minDotPosition = 0.5; // Starting position for dot in rems
        const maxDotTravel = mouseHeight - dotHeight - minDotPosition * 16; // Convert rem to px
        
        // Apply position
        const dotPosition = minDotPosition + Math.max(0, Math.min(maxDotTravel, scrollPercentage * maxDotTravel)) / 16; // Convert px to rem
        mouseDot.style.top = `${dotPosition}rem`;
    };
    
    // Update on scroll
    window.addEventListener('scroll', updateScrollPosition);
    
    // Set initial position
    updateScrollPosition();
    
    // Direct DOM manipulation for fade out
    const fadeOut = () => {
        // Use direct style manipulation rather than classes
        mouseIndicator.style.opacity = "0";
        setTimeout(() => {
            mouseIndicator.style.visibility = "hidden";
        }, 1000); // After transition completes
    };
    
    const fadeIn = () => {
        // Make visible first, then fade in
        mouseIndicator.style.visibility = "visible";
        // Force a reflow
        void mouseIndicator.offsetWidth;
        mouseIndicator.style.opacity = "1";
    };
    
    // Show initially
    fadeIn();
    
    // Fade out after 4 seconds (increased from 3)
    let fadeTimeout = setTimeout(fadeOut, 4000);
    
    // Show when scrolling, hide after 3 seconds of inactivity (increased from 2)
    window.addEventListener('scroll', () => {
        // Cancel any pending fade out
        clearTimeout(fadeTimeout);
        
        // Make visible
        fadeIn();
        
        // Schedule fade out
        fadeTimeout = setTimeout(fadeOut, 3000);
    });
}; 