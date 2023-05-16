import cardData from "../data/cards.js"
import { loadTitleComponent } from "./component.js"

export const loadCards = () => {
    return cardData.map((data) => {
        // Create a card container
        let card = document.createElement('div')
        const classes = ['card', data.id]
        card.classList.add(...classes)
        // create a card title
        const titleComponent = loadTitleComponent(data.title, data.subtitle)
        // const navComponent = loadNavComponent(cardData)
        card.appendChild(titleComponent)
        let cardRendered
        switch (data.id) {
            case 'projects':
                cardRendered = loadProjectsCard(data.data, card)
                break
            case 'contact':
                cardRendered = loadContactCard(data.data, card)
                break
            default:
                cardRendered = loadCard(data, card)
        }
        cardRendered.id = data.id
        return cardRendered
    })
}

export const loadCard = (data, card = null) => {
    if (!card) {
        card = document.createElement('div')
    }

    if (data.image) {
        const cardImageContainer = document.createElement('div')
        cardImageContainer.className = 'card-image'
        const cardImage = document.createElement('img')
        cardImage.src = data.image
        cardImageContainer.appendChild(cardImage)
        card.appendChild(cardImageContainer)
    }

    if (data.description) {
        const descriptionContainer = document.createElement('div')
        descriptionContainer.className = 'description-container'
        const cardDescription = document.createElement('p')
        cardDescription.innerText = data.description
        cardDescription.className = 'description'
        descriptionContainer.appendChild(cardDescription)
        card.appendChild(descriptionContainer)
    }

    // Put it all together
    return card
}

const loadProjectsCard = (data, card) => {
    data.forEach((project) => {
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

const loadContactCard = (data, card) => {
    const form = document.createElement('form')
    form.className = 'contact-form'
    const formInner = document.createElement('div')
    formInner.className = 'form-inner'
    form.className = 'contact-form'
    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.name = 'name'
    nameInput.placeholder = 'Name'
    const emailInput = document.createElement('input')
    emailInput.type = 'email'
    emailInput.name = 'email'
    emailInput.placeholder = 'Email'
    const messageInput = document.createElement('textarea')
    messageInput.name = 'message'
    messageInput.placeholder = 'Message'
    const submitButton = document.createElement('button')
    submitButton.type = 'submit'
    submitButton.innerText = 'Send'
    formInner.appendChild(nameInput)
    formInner.appendChild(emailInput)
    formInner.appendChild(messageInput)
    formInner.appendChild(submitButton)
    form.appendChild(formInner)
    card.appendChild(form)
    return card
}

