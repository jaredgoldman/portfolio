import projects from '../data/projects.js'

const loadProjects = () => {
    return projects.data.map((project) => {
        const heading = document.createElement('h2')
        heading.classList.add('project-title')
        heading.textContent = project.title
        heading.id = project.id
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
        deployed.textContent = project.deployed.split('/')[2]
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
    const modal = document.querySelector('#projectModal')
    const projects = document.querySelectorAll('.project-title')
    projects.forEach((project) => {
        project.addEventListener('click', (event) => {
            loadModalContent(event.target.id)
            modal.style.display = 'block'
        })
    })

    const close = document.querySelector('.close')
    close.addEventListener('click', () => {
        closeModal(modal)
    })
}

const closeModal = (modal) => {
    const modalRight = document.querySelector('.modal-content_right')
    const modalLeft = document.querySelector('.modal-content_left')

    modal.style.display = 'none'

    modalLeft.removeChild(modalLeft.firstChild)
    modalRight.removeChild(modalRight.firstChild)
}

const loadProjectHeadings = () => {
    const projectsContainer = document.querySelector('.projects-inner')
    const projects = loadProjects()
    projects.forEach((project) => {
        projectsContainer.appendChild(project)
    })
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjectHeadings()
    setupProjectListeners()
})
