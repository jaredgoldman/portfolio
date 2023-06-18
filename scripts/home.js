import { stopTouchPropagation } from './utils.js'

// Ensure mobile devices can be accessed on mobile
export const loadHomeContent = () => {
    const aboutLinks = document.querySelectorAll('.about-links a')
    aboutLinks.forEach((link) => {
        stopTouchPropagation(link)
    })
}
