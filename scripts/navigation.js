import { adjustUrlParams } from "./utils.js";

let localCardIndex

export const setupButtons = (container, cards, cardIndex) => {
    localCardIndex = cardIndex
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((navItem) => {
        navItem.addEventListener("click", () => {
            transitionCard(
                navItem.innerText.toLowerCase(),
                cards, container,
                navItems
            );
        });
    })
}

const transitionCard = (nextCardName, cards, container, navItems) => {
    console.log({
        localCardIndex
    })
    // TODO: disable all buttons
    navItems.forEach((navItem) => {
        navItem.classList.add("disabled")
    })

    // update url
    adjustUrlParams(nextCardName)
    // find what the current card is
    const currentCard = cards[localCardIndex]
    // find what the next card is
    const nextCardIndex = cards.findIndex((card) => card.id === nextCardName)
    const nextCard = cards[nextCardIndex]
    // figure out what directiion we need to swipe to get to that card
    const transitionDirection = localCardIndex > nextCardIndex ? 'right' : 'left'

    // add appropriate classes to create transition
    let currentCardClass = 'slide-out-left'
    let nextCardClass = 'slide-in-right'
    if (transitionDirection === 'right') {
        currentCardClass = 'slide-out-right'
        nextCardClass = 'slide-in-left'
    }

    // console.log({
    //     currentCard,
    //     nextCard,
    // })
    // make the magic happen
    currentCard.classList.add(currentCardClass)
    nextCard.classList.add(nextCardClass)
    container.appendChild(nextCard)

    setTimeout(() => {
        currentCard.classList.remove(currentCardClass)
        nextCard.classList.remove(nextCardClass)
        // Remove current card from DOM
        if (container.contains(currentCard) && currentCard !== nextCard) {
            container.removeChild(currentCard)
        }
        navItems.forEach((navItem) => {
            if (navItem.innerText.toLowerCase() !== nextCardName) {
                navItem.classList.remove('disabled')
            }
        })

    }, 1000)

    localCardIndex = nextCardIndex
}


