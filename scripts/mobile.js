import { stopTouchPropagation } from './utils.js'

// Ensure mobile devices can be accessed on mobile
export const disableMobileTouchPropogation = () => {
    const aboutLinks = document.querySelectorAll('.about-links a')
    const projects = document.querySelectorAll('.project-title')
    const header = document.querySelector('.header')
    aboutLinks.forEach((link) => {
        stopTouchPropagation(link)
    })
    projects.forEach((project) => {
        stopTouchPropagation(project)
    })
    stopTouchPropagation(header)
}
