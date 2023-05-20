import projects from '../data/projects.js'

const loadProjects = () => {
    return projects.data.map((project) => {
        const container = document.createElement('div')
        container.classList.add('project')
        const heading = document.createElement('h2')
        heading.classList.add('project-title')
        heading.textContent = project.title
        container.appendChild(heading)
        if (project.github) {
            const link = document.createElement('a')
            link.href = project.github
            link.textContent = 'github'
            link.classList.add('project-link')
            container.appendChild(link)
        }
        if (project.deployed) {
            const link = document.createElement('a')
            link.href = project.github
            link.textContent = 'live'
            link.classList.add('project-link')
            container.appendChild(link)
        }
        return container
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector('.projects-inner')
    const projects = loadProjects()
    projects.forEach((project) => {
        projectsContainer.appendChild(project)
    })
})
