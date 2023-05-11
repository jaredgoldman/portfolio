const cardData = [
    {
        title: 'Card 1',
        description: 'This is card 1',
        image: 'https://picsum.photos/200/300'
    },
    {
        title: 'Card 2',
        description: 'This is card 2',
        image: 'https://picsum.photos/200/300'
    },
    {
        title: 'Card 3',
        description: 'This is card 3',
        image: 'https://picsum.photos/200/300'
    }
]

document.addEventListener('DOMContentLoaded', () => {
    cards = loadCards()
    let cardIndex = 0

    const container = document.querySelector('#card-container')
    container.appendChild(cards[cardIndex])

    const transitionCard = (direction = 'next') => {
        let currentCardClass = 'slide-out-left'
        let nextCardClass = 'slide-in-right'
        if (direction === 'next' && cardIndex < cards.length - 1) {
            cardIndex += 1
        } else if (direction === 'prev' && cardIndex > 0) {
            cardIndex -= 1
            currentCardClass = 'slide-out-right'
            nextCardClass = 'slide-in-left'
        } else {
            return
        }

        // Grab the current card and the next card
        const currentCard = container.firstChild
        const nextCard = cards[cardIndex]
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
    }

    // Setup prev and next buttons
    const prevButton = document.querySelector('.prev-button')
    const nextButton = document.querySelector('.next-button')
    prevButton.addEventListener('click', () => transitionCard('prev'))
    nextButton.addEventListener('click', () => transitionCard())
})

const loadCards = () => {
    return cardData.map((card) => {
        // Create a card container
        cardContainer = document.createElement('div')
        cardContainer.className = 'card'

        // create a card title
        cardTitle = document.createElement('h2')
        cardTitle.innerText = card.title

        // create a card description
        cardDescription = document.createElement('p')
        cardDescription.innerText = card.description

        // create a card image container
        cardImageContainer = document.createElement('div')
        cardImageContainer.className = 'card-image'

        // Insert card image
        cardImage = document.createElement('img')
        cardImage.src = card.image

        // Append card image to card image container
        cardImageContainer.appendChild(cardImage)

        // Put it all together
        cardContainer.appendChild(cardTitle)
        cardContainer.appendChild(cardDescription)
        cardContainer.appendChild(cardImageContainer)
        return cardContainer
    })
}


