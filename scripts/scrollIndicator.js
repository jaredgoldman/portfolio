/**
 * Handles the scroll indicator functionality
 * Shows the scroll indicator on desktop/web devices only
 */

import { RESPONSIVE_BREAKPOINT } from '../constants.js'

export const loadScrollIndicator = () => {
    const scrollIndicator = document.getElementById('scroll-indicator')
    const container = document.getElementById('container')
    let isWebDevice = window.innerWidth > RESPONSIVE_BREAKPOINT
    let hasScrolled = false
    
    // Function to update indicator visibility
    const updateIndicatorVisibility = () => {
        // Only show on web devices (not mobile)
        if (isWebDevice && !hasScrolled) {
            scrollIndicator.classList.add('visible')
        } else {
            scrollIndicator.classList.remove('visible')
        }
    }
    
    // Initialize visibility
    updateIndicatorVisibility()

    // Hide scroll indicator after first horizontal scroll
    container.addEventListener('scroll', () => {
        if (!hasScrolled && container.scrollLeft > 10) {
            hasScrolled = true
            updateIndicatorVisibility()
        }
    })
    
    // Update based on window resize (for responsive design)
    window.addEventListener('resize', () => {
        isWebDevice = window.innerWidth > RESPONSIVE_BREAKPOINT
        updateIndicatorVisibility()
    })
} 