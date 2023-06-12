import projects from '../data/projects.js'
import { request } from './utils.js'

const loadProjects = async () => {
    const { data } = await request('/projects')
    return data.map(({ attributes }) => {
        const heading = document.createElement('h2')
        heading.classList.add('project-title')
        heading.textContent = attributes.title
        heading.id = attributes.title.toLowerCase().replace(/\s/g, '-')
        return heading
    })
}

const loadModalContent = (projectId) => {
    const project = projects.data.find((project) => project.id === projectId)
    const modalRight = document.querySelector('.modal-content_right')
    const modalLeft = document.querySelector('.modal-content_left')

    const modalTitle = document.querySelector('.modal-title')
    modalTitle.textContent = project.title

    const description = document.createElement('p')
    description.textContent = project.description
    description.classList.add('modal-description')

    const links = document.createElement('div')
    links.classList.add('modal-links')

    if (project.deployed) {
        const deployed = document.createElement('a')
        deployed.href = project.deployed
        deployed.textContent = 'Visit Site'
        deployed.classList.add('modal-link')
        links.appendChild(deployed)
    }

    if (project.github) {
        const github = document.createElement('a')
        github.href = project.github
        github.textContent = 'Github'
        github.classList.add('modal-link')
        links.appendChild(github)
    }

    description.appendChild(links)

    const imageContainer = document.createElement('div')
    imageContainer.classList.add('image-container')

    const image = document.createElement('img')
    image.src = project.image

    imageContainer.appendChild(image)
    modalLeft.appendChild(imageContainer)
    modalRight.appendChild(description)
}

const setupProjectListeners = () => {
    const modal = document.querySelector('#project-modal')
    const projects = document.querySelectorAll('.project-title')
    const close = document.querySelector('.close')

    projects.forEach((project) => {
        project.addEventListener('click', (event) => {
            openModal(event, modal)
        })
    })

    close.addEventListener('click', () => {
        closeModal(modal)
    })
}

const openModal = (event, modal) => {
    loadModalContent(event.target.id)
    //XXX: add fomralized fade method here
    modal.showModal()
    modal.classList.add('fade-in')
    handleBackgroundElementVisibility(false)
}

export const closeModal = () => {
    const modal = document.querySelector('#project-modal')
    const modalRight = document.querySelector('.modal-content_right')
    const modalLeft = document.querySelector('.modal-content_left')

    modal.classList.remove('fade-in')
    modal.classList.add('fade-out')

    setTimeout(() => {
        handleBackgroundElementVisibility(true)
        modal.classList.remove('fade-out')
        modal.close()
        modalLeft.removeChild(modalLeft.firstChild)
        modalRight.removeChild(modalRight.firstChild)
    }, 300)
}

const loadProjectHeadings = async () => {
    const projectsContainer = document.querySelector('#projects')
    const projects = await loadProjects()
    projects.forEach((project) => {
        projectsContainer.appendChild(project)
    })
}

const handleBackgroundElementVisibility = (visibility) => {
    const main = document.querySelector('#main')
    const nav = document.querySelector('#navigation')
    if (visibility) {
        main.style.display = 'block'
        nav.style.display = 'block'
    } else {
        main.style.display = 'none'
        nav.style.display = 'none'
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadProjectHeadings()
    setupProjectListeners()
})
