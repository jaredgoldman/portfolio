import { loadNavigation } from './navigation.js'
import { loadBio } from './bio.js'
import { loadParticles } from './particles.js'
import { loadMode } from './mode.js'
import { loadContact } from './contact.js'
import { loadProjects, areProjectsLoaded } from './projects.js'
import { disableMobileTouchPropogation } from './mobile.js'
import { loadScrollIndicator } from './scrollIndicator.js'
import { loadPillIndicator } from './pillIndicator.js'

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
    
    // Start loading projects early but don't await it
    const projectsPromise = loadProjects();
    
    // Begin loading other resources
    await loadParticles()
    await loadNavigation()
    await loadBio()
    disableMobileTouchPropogation()
    loadMode()
    loadContact()
    loadScrollIndicator()
    loadPillIndicator()
    
    // Fade out the loader after core resources are loaded
    fadeOutLoader();
    
    // Continue loading projects in the background
    projectsPromise.catch(error => {
        console.error('Error loading projects:', error);
    });
})
