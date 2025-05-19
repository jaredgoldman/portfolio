import { request, stopTouchPropagation } from './utils.js'

let projects = []
export let projectsLoaded = false;

export const areProjectsLoaded = () => {
    return projectsLoaded;
};

const loadProjectData = async () => {
    const { data } = await request('/projects?populate=image')

    // map project data for later use
    projects = data
        .map((project) => {
            return {
                ...project.attributes,
                id: project.attributes.title.toLowerCase().replace(/\s/g, '-'),
            }
        })
        .sort((a, b) => {
            const aDate = new Date(a.date)
            const bDate = new Date(b.date)
            return bDate - aDate
        })
    // return html elements representing project headings
    return projects.map((project) => {
        const heading = document.createElement('div')
        heading.classList.add('project-title')
        const projectTitle = document.createElement('span')
        projectTitle.classList.add('project-title_heading')
        projectTitle.textContent = project.title
        projectTitle.id = project.title.toLowerCase().replace(/\s/g, '-')
        const projectYear = document.createElement('span')
        projectYear.innerText = ` (${project.date.split('-')[0]})`
        projectYear.classList.add('project-title_year')
        heading.appendChild(projectTitle)
        heading.appendChild(projectYear)
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
    const projects = document.querySelectorAll('.project-title_heading')
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

    // Add event listener for escape key
    modal.addEventListener('cancel', (event) => {
        event.preventDefault()
        closeModal()
    })
}

const openModal = (event, modal) => {
    console.log(event.target.id)
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
    projectsLoaded = true;
}
