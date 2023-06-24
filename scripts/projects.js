import { request, stopTouchPropagation } from './utils.js'

let projects = []

const loadProjectData = async () => {
    const { data } = await request('/projects?populate=image')

    // map projects for later use
    projects = data.map((project) => {
        return {
            ...project.attributes,
            id: project.attributes.title.toLowerCase().replace(/\s/g, '-'),
        }
    })

    return data.map(({ attributes }) => {
        const heading = document.createElement('h2')
        heading.classList.add('project-title')
        heading.textContent = attributes.title
        heading.id = attributes.title.toLowerCase().replace(/\s/g, '-')
        return heading
    })
}

/**
 * @param {string} projectId
 * loads content into modal element lazily on-click
 * TODO: Figure out how to pre-load images in modal
 */
const loadModalContent = (projectId) => {
    const project = projects.find((project) => project.id === projectId)
    const modalRight = document.querySelector('.modal-content_right')
    const modalLeft = document.querySelector('.modal-content_left')

    const modalTitle = document.querySelector('.modal-title')
    modalTitle.textContent = project.title

    const description = document.createElement('div')
    description.innerHTML = project.description
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

    const imageContainer = document.createElement('div')

    if (project?.image?.data?.attributes?.url) {
        imageContainer.classList.add('image-container')
        const image = document.createElement('img')
        image.src = project.image.data.attributes.url
        imageContainer.appendChild(image)
    }

    description.appendChild(links)
    modalLeft.appendChild(imageContainer)
    modalRight.appendChild(description)
}

const setupProjectListeners = () => {
    const modal = document.getElementById('project-modal')
    const projects = document.querySelectorAll('.project-title')
    const close = document.getElementById('modal-close')

    projects.forEach((project) => {
        project.addEventListener('click', (event) => {
            openModal(event, modal)
        })
    })

    stopTouchPropagation(close)
    close.addEventListener('click', () => {
        closeModal(modal)
    })
}

const openModal = (event, modal) => {
    loadModalContent(event.target.id)
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
/**
 * Map project headings to clickable links
 */
const loadProjectHeadings = async () => {
    const projectsContainer = document.querySelector('#projects')
    const projects = await loadProjectData()
    projects.forEach((project) => {
        projectsContainer.appendChild(project)
    })
}

const handleBackgroundElementVisibility = (visibility) => {
    const main = document.querySelector('#main')
    const nav = document.querySelector('#navigation')
    if (visibility) {
        main.style.display = 'flex'
        nav.style.display = 'block'
    } else {
        main.style.display = 'none'
        nav.style.display = 'none'
    }
}

export const loadProjects = async () => {
    await loadProjectHeadings()
    setupProjectListeners()
}
