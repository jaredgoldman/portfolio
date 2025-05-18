import { loadNavigation } from './navigation.js'
import { loadBio } from './bio.js'
import { loadParticles } from './particles.js'
import { loadMode } from './mode.js'
import { loadContact } from './contact.js'
import { loadProjects, areProjectsLoaded } from './projects.js'
import { disableMobileTouchPropogation } from './mobile.js'
import { loadScrollIndicator } from './scrollIndicator.js'

/**
 * Keep the loader visible initially
 */
const initLoader = () => {
    const loaderOverlay = document.querySelector('.loader-overlay');
    if (loaderOverlay) {
        // Remove the default animation to keep it visible
        loaderOverlay.style.animation = 'none';
        loaderOverlay.style.opacity = '1';
    }
}

/**
 * Fade out the loader once everything is loaded
 */
const fadeOutLoader = () => {
    const loaderOverlay = document.querySelector('.loader-overlay');
    if (loaderOverlay) {
        // Apply the fadeout animation
        loaderOverlay.style.animation = 'fadeOut 1.25s ease-in-out forwards';
    }
}

/**
 * Main js loading process
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the loader to stay visible
    initLoader();
    
    // Begin loading resources
    await loadParticles()
    await loadNavigation()
    await loadBio()
    await loadProjects()
    disableMobileTouchPropogation()
    loadMode()
    loadContact()
    loadScrollIndicator()
    
    // If we're not on the projects page, fade out the loader
    const currentSection = window.location.pathname.split('/').pop() || 
                         window.location.hash.substring(1);
    
    if (currentSection !== 'projects' || areProjectsLoaded()) {
        fadeOutLoader();
    }
    // Otherwise, the navigation.js will handle fading out the loader
})
