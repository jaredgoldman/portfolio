import { adjustUrlParams } from "./utils.js";
import cardData from "../data/cards.js"

export const setupButtons = (cardIndex, container, cards) => {
    const prevButton = document.querySelector(".prev-button");
    const nextButton = document.querySelector(".next-button");
    handleButtonAbility(prevButton, nextButton, cards.length, cardIndex);

    prevButton.addEventListener("click", () => {
        cardIndex = handleButtonClick(
            "prev",
            cardIndex,
            container,
            cards,
            prevButton,
            nextButton
        );
    });

    nextButton.addEventListener("click", () => {
        cardIndex = handleButtonClick(
            "next",
            cardIndex,
            container,
            cards,
            prevButton,
            nextButton
        );
    });
}

const handleButtonClick = (
    direction,
    cardIndex,
    container,
    cards,
    prevButton,
    nextButton
) => {
    cardIndex = transitionCard(direction, cardIndex, container, cards);
    handleButtonAbility(prevButton, nextButton, cards.length, cardIndex);
    adjustUrlParams(cardData[cardIndex].class);
    return cardIndex;
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
