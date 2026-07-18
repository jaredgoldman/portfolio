/**
 * Handles the scroll indicator functionality
 * Shows the scroll indicator on desktop/web devices only
 */

import { RESPONSIVE_BREAKPOINT } from '../constants.js'

export const loadScrollIndicator = () => {
    const scrollIndicator = document.getElementById('scroll-indicator')
    if (!scrollIndicator) return;

    let isWebDevice = window.innerWidth > RESPONSIVE_BREAKPOINT

    const showAndFadeIndicator = () => {
        if (!isWebDevice) return;

        scrollIndicator.classList.remove('fade-out');
        scrollIndicator.classList.add('visible');

        setTimeout(() => {
            scrollIndicator.classList.add('fade-out');

            setTimeout(() => {
                scrollIndicator.classList.remove('visible');
                scrollIndicator.classList.remove('fade-out');
            }, 1000); // match CSS transition duration
        }, 4000); // display duration before fading
    };

    setTimeout(showAndFadeIndicator, 1000);

    window.addEventListener('resize', () => {
        isWebDevice = window.innerWidth > RESPONSIVE_BREAKPOINT;
    });
}
