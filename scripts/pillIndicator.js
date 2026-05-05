/**
 * Controls the mouse-shaped scroll indicator with bobbing dot in the top right
 */

export const loadPillIndicator = () => {
    const mouseIndicator = document.getElementById('pill-indicator');
    const mouseDot = mouseIndicator?.querySelector('.pill-dot');
    const container = document.getElementById('container');

    if (!mouseIndicator || !mouseDot) {
        console.warn('Mouse indicator elements not found');
        return;
    }

    // Start the bobbing animation
    mouseDot.classList.add('bobbing');

    // Function to update dot position based on horizontal scroll
    const updateScrollPosition = () => {
        const maxScroll = container
            ? container.scrollWidth - container.clientWidth
            : 0;

        // Calculate scroll percentage (0 to 1), clamped
        const scrollPercentage = maxScroll > 0
            ? Math.max(0, Math.min(1, container.scrollLeft / maxScroll))
            : 0;

        // Calculate dot position within pill bounds (top = first card, bottom = last card)
        const pillHeight = mouseIndicator.offsetHeight;
        const dotHeight = mouseDot.offsetHeight;
        const minDotPosition = 0.5; // rem — starting offset from top
        const maxDotTravel = pillHeight - dotHeight - minDotPosition * 16; // px

        const dotPositionRem = minDotPosition + (scrollPercentage * Math.max(0, maxDotTravel)) / 16;
        mouseDot.style.top = `${dotPositionRem}rem`;
    };

    const fadeOut = () => {
        mouseIndicator.style.opacity = '0';
        setTimeout(() => {
            mouseIndicator.style.visibility = 'hidden';
        }, 1000); // after transition completes
    };

    const fadeIn = () => {
        if (mouseIndicator.style.visibility === 'visible') return;
        mouseIndicator.style.visibility = 'visible';
        void mouseIndicator.offsetWidth; // force reflow so opacity transition fires
        mouseIndicator.style.opacity = '1';
    };

    // Show initially and set initial dot position
    fadeIn();
    updateScrollPosition();

    // Fade out after 4 seconds of initial load
    let fadeTimeout = setTimeout(fadeOut, 4000);

    // React to container scroll events (fired when navigation.js sets scrollLeft)
    if (container) {
        container.addEventListener('scroll', () => {
            updateScrollPosition();

            clearTimeout(fadeTimeout);
            fadeIn();
            fadeTimeout = setTimeout(fadeOut, 3000);
        });
    }
};
