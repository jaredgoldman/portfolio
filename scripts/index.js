import { loadNavigation } from './navigation.js'
import { loadBio } from './bio.js'
import { loadParticles } from './particles.js'
import { loadMode } from './mode.js'
import { loadContact } from './contact.js'
import { loadProjects } from './projects.js'

document.addEventListener('DOMContentLoaded', async () => {
    await loadNavigation()
    await loadBio()
    await loadProjects()
    loadParticles()
    loadMode()
    loadContact()
})
