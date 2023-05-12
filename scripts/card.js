import cardData from "../data/cards.js"
import { loadTitleComponent } from "./component.js"

export const loadCards = () => {
    return cardData.map((cardData) => {
        // Create a card container
        const card = document.createElement('div')
        const classes = ['card', cardData.class]
        card.classList.add(...classes)
        // create a card title
        const titleComponent = loadTitleComponent(cardData.title, cardData.subtitle)
        card.appendChild(titleComponent)


        if (cardData.class === 'projects') {
            return loadProjectsCard(cardData.data, card)
        } else {
            return loadCard(cardData, card)
        }
    })
}

export const loadCard = (cardData, card = null) => {
    if (!card) {
        card = document.createElement('div')
    }
    // create a card description
    const descriptionContainer = document.createElement('div')
    descriptionContainer.className = 'description-container'
    const cardDescription = document.createElement('p')
    cardDescription.innerText = cardData.description
    cardDescription.className = 'description'
    descriptionContainer.appendChild(cardDescription)

    // create a card image container
    const cardImageContainer = document.createElement('div')
    cardImageContainer.className = 'card-image'

    if (cardData.image) {
        // Insert card image
        const cardImage = document.createElement('img')
        cardImage.src = cardData.image
        // Append card image to card image container
        cardImageContainer.appendChild(cardImage)

    }

    // Put it all together
    card.appendChild(descriptionContainer)
    card.appendChild(cardImageContainer)
    return card
}



const loadProjectsCard = (projectData, card) => {
    projectData.forEach((project) => {
        const section = document.createElement('section')
        const innerCard = document.createElement('div')
        innerCard.className = 'inner-card'
        const title = document.createElement('h3')
        title.className = 'project-title'
        title.innerText = project.title

        const imageDescription = document.createElement('div')
        imageDescription.className = 'image-description'

        const descriptionContainer = document.createElement('div')
        descriptionContainer.className = 'description-container'
        const description = document.createElement('p')
        description.innerText = project.description
        description.className = 'project-description'

        descriptionContainer.appendChild(description)

        const linksContainer = document.createElement('div')
        linksContainer.className = 'links-container'

        if (project.github) {
            const githubLink = document.createElement('a')
            githubLink.className = 'project-link'
            githubLink.href = project.github
            githubLink.innerText = 'See it on Github'
            linksContainer.appendChild(githubLink)
        }
        if (project.deployed) {
            const deployedLink = document.createElement('a')
            deployedLink.className = 'project-link'
            deployedLink.href = project.deployed
            deployedLink.innerText = 'See it live'
            linksContainer.appendChild(deployedLink)
        }

        descriptionContainer.appendChild(linksContainer)

        const image = document.createElement('img')
        image.src = project.image

        imageDescription.appendChild(image)
        imageDescription.appendChild(descriptionContainer)

        innerCard.appendChild(title)
        innerCard.appendChild(imageDescription)
        section.appendChild(innerCard)
        card.appendChild(section)
    })
    return card
}
