const cardData = [
    {
        title: 'About me',
        description: 'This card is about me',
        image: 'https://picsum.photos/200/300',
        class: 'about'
    },
    {
        title: 'Projects',
        description: 'This card is about my projects',
        image: 'https://picsum.photos/200/300',
        class: 'projects',
        data: [
            {
                title: 'Project 1',
                description: 'This is project 1',
                image: 'https://picsum.photos/200/300',
                github: 'https://github.com',
                deployed: 'https://google.com'
            },
            {
                title: 'Project 2',
                description: 'This is project 2',
                image: 'https://picsum.photos/200/300',
                github: '',
                deployed: ''
            },
            {
                title: 'Project 3',
                description: 'This is project 3',
                image: 'https://picsum.photos/200/300',
                github: '',
                deployed: ''
            },
            {
                title: 'Project 4',
                description: 'This is project 4',
                image: 'https://picsum.photos/200/300',
                github: '',
                deployed: ''
            },
        ]
    },
    {
        title: 'Resume',
        description: 'This card features my resume',
        image: 'https://picsum.photos/200/300',
        class: 'resume'
    }
]

document.addEventListener('DOMContentLoaded', () => {
    // log current url
    const urlParams = new URLSearchParams(window.location.search);
    const lastPath = urlParams.get("card");

    let cardIndex = 0
    const cards = loadCards()
    let card = cards[cardIndex]

    // Account for refresh
    if (lastPath) {
        cardIndex = cardData.findIndex((card) => card.class === lastPath)
        card = loadCard(cardData[cardIndex])
    }

    const container = document.querySelector('#card-container')

    // add fade-in animation
    container.classList.add('fade-in')
    container.appendChild(cards[cardIndex])

    // Setup prev and next buttons
    const prevButton = document.querySelector('.prev-button')
    const nextButton = document.querySelector('.next-button')
    handleButtonAbility(prevButton, nextButton, cards.length, cardIndex)

    prevButton.addEventListener('click', () => {
        cardIndex = transitionCard('prev', cardIndex, container, cards)
        handleButtonAbility(prevButton, nextButton, cards.length, cardIndex)
        adjustUrlParams(cardData[cardIndex].class)
    })
    nextButton.addEventListener('click', () => {
        cardIndex = transitionCard('next', cardIndex, container, cards)
        handleButtonAbility(prevButton, nextButton, cards.length, cardIndex)
        adjustUrlParams(cardData[cardIndex].class)
    })

})

const adjustUrlParams = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("card", param);
    window.history.replaceState(null, "", "?" + urlParams.toString());
}

const handleButtonAbility = (prevButton, nextButton, cardLength, cardIndex) => {
    if (cardIndex === 0) {
        prevButton.disabled = true
    } else if (cardIndex === cardLength - 1) {
        nextButton.disabled = true
    } else {
        prevButton.disabled = false
        nextButton.disabled = false
    }
}

const transitionCard = (direction, cardIndex, container, cards) => {
    let currentCardClass = 'slide-out-left'
    let nextCardClass = 'slide-in-right'
    let nextCardIndex = cardIndex
    if (direction === 'next' && cardIndex < cards.length - 1) {
        nextCardIndex += 1
    } else if (direction === 'prev' && cardIndex > 0) {
        nextCardIndex -= 1
        currentCardClass = 'slide-out-right'
        nextCardClass = 'slide-in-left'
    } else {
        return
    }

    // Grab the current card and the next card
    const currentCard = container.firstChild
    const nextCard = cards[nextCardIndex]
    currentCard.classList.add(currentCardClass)
    nextCard.classList.add(nextCardClass)
    container.appendChild(nextCard)

    setTimeout(() => {
        // Remove current card from DOM
        container.removeChild(currentCard)
        // Add next card to DOM
        nextCard.classList.remove(nextCardClass)
        currentCard.classList.remove(currentCardClass)
    }, 1000)

    return nextCardIndex
}

const adjustCssVar = (property, value) => {
    document.documentElement.style.setProperty(property, value)
}

const loadCards = () => {
    return cardData.map((cardData) => {
        // Create a card container
        card = document.createElement('div')
        const classes = ['card', cardData.class]
        card.classList.add(...classes)


        if (cardData.class === 'projects') {
            return loadProjectsCard(cardData.data, card)
        } else {
            return loadCard(cardData, card)
        }
    })
}


const loadCard = (cardData, card = null) => {
    if (!card) {
        card = document.createElement('div')
    }
    // create a card title
    cardTitle = document.createElement('h2')
    cardTitle.innerText = cardData.title

    // create a card description
    cardDescription = document.createElement('p')
    cardDescription.innerText = cardData.description

    // create a card image container
    cardImageContainer = document.createElement('div')
    cardImageContainer.className = 'card-image'

    // Insert card image
    cardImage = document.createElement('img')
    cardImage.src = cardData.image

    // Append card image to card image container
    cardImageContainer.appendChild(cardImage)

    // Put it all together
    card.appendChild(cardTitle)
    card.appendChild(cardDescription)
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



