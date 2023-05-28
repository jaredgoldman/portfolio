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
    console.log(project)
    const modalContent = document.querySelector('.modal-content')
    const title = document.createElement('h2')
    title.textContent = project.title
    title.classList.add('modal-title')
    const description = document.createElement('p')
    description.textContent = project.description
    description.classList.add('modal-description')
    const image = document.createElement('img')
    image.src = project.image

    modalContent.appendChild(title)
    modalContent.appendChild(description)
    modalContent.appendChild(image)
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
    modal.style.display = 'none'
    const modalContent = document.querySelector('.modal-content')

    // remove all childeren of modalContent
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild)
    }
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
