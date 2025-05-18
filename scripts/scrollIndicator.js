/**
 * Handles the scroll indicator functionality
 * Shows the scroll indicator on desktop/web devices only
 */

import { RESPONSIVE_BREAKPOINT } from '../constants.js'

export const loadScrollIndicator = () => {
    const scrollIndicator = document.getElementById('scroll-indicator')
    
    let isWebDevice = window.innerWidth > RESPONSIVE_BREAKPOINT
    
    // Function to show indicator and then fade it out
    const showAndFadeIndicator = () => {
        if (!isWebDevice) return;
        
        // First clear any existing classes
        scrollIndicator.classList.remove('fade-out');
        
        // Make it visible
        scrollIndicator.classList.add('visible');
        
        // Set timeout to add fade-out class
        setTimeout(() => {
            // Add the fade-out class
            scrollIndicator.classList.add('fade-out');
            
            // Remove the visible class after fade animation completes
            setTimeout(() => {
                scrollIndicator.classList.remove('visible');
                scrollIndicator.classList.remove('fade-out');
            }, 1000); // Match the CSS transition duration
        }, 4000); // How long to show before fading
    };
    
    // Initialize indicator with a delay to ensure DOM is ready
    setTimeout(showAndFadeIndicator, 1000);
    
    // Update device status on resize, but don't show indicator
    window.addEventListener('resize', () => {
        isWebDevice = window.innerWidth > RESPONSIVE_BREAKPOINT;
    });
    
    // Show on page load
    window.addEventListener('load', () => {
        setTimeout(showAndFadeIndicator, 1500);
    });
} 