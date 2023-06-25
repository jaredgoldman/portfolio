import { loadNavigation } from './navigation.js'
import { loadBio } from './bio.js'
import { loadParticles } from './particles.js'
import { loadMode } from './mode.js'
import { loadContact } from './contact.js'
import { loadProjects } from './projects.js'
import { disableMobileTouchPropogation } from './mobile.js'

/**
 * Main js loading process
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadParticles()
    await loadNavigation()
    await loadBio()
    await loadProjects()
    disableMobileTouchPropogation()
    loadMode()
    loadContact()
})
