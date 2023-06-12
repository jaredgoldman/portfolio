import { triggerInitialOverlay } from './overlay.js'
import { closeModal } from './projects.js'
import {
    easeInOutQuad,
    handleClassVisibility,
    handleAnimationEnd,
} from './utils.js'
import { CARD_TRANSITION_DURATION, MOBILE_BREAKPOINT } from '../constants.js'

let observer
let cards
let container
let cardIndex = 0
let initialLoad = true
export let isScrolling = false

const handleCardTransition = (event) => {
    event.preventDefault()

    if (event.target.id === 'bio') {
        return
    }

    if (isScrolling) return
    let scrollDirection
    const currentCard = cards[cardIndex]
    const modal = document.querySelector('#project-modal')
    // close modal if open
    if (
        currentCard?.id === 'card-projects' &&
        modal.style.display === 'block'
    ) {
        setTimeout(() => {
            closeModal()
        }, 500)
    }

    if (event.type === 'keydown') {
        event.key === 'ArrowRight'
            ? (scrollDirection = 1)
            : (scrollDirection = -1)
    }
    if (event.type === 'wheel') {
        const deltaX = event.deltaX
        const deltaY = event.deltaY

        // Calculate the absolute delta values
        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)

        // Compare the absolute delta values
        if (absDeltaX > absDeltaY) {
            scrollDirection = Math.sign(event.deltaX)
        } else if (absDeltaY > absDeltaX) {
            scrollDirection = Math.sign(event.deltaY)
        }
    }
    if (event.type === 'click') {
        scrollDirection = event.target.id === 'next-chev' ? 1 : -1
    }

    // disable scrolling right on the last card
    if (
        scrollDirection === 1 &&
        cards[cards.length - 1].classList.contains('focused')
    ) {
        return
    }
    // find distance to the next card
    const cardWidth = cards[0].offsetWidth
    const cardMarginRight = parseInt(
        window.getComputedStyle(cards[0]).marginRight
    )
    const cardMarginLeft = parseInt(
        window.getComputedStyle(cards[0]).marginLeft
    )
    const cardDistance = cardWidth + cardMarginRight + cardMarginLeft

    const scrollDistance = Math.max(cardDistance, window.innerWidth)
    const currentScrollPosition = container.scrollLeft

    let targetScrollPosition =
        currentScrollPosition + scrollDistance * scrollDirection
    targetScrollPosition =
        Math.round(targetScrollPosition / cardDistance) * cardDistance

    // Smoothly scroll the container
    smoothScrollTo(targetScrollPosition)
    isScrolling = true
    // Update the card index
    scrollDirection === 1 ? cardIndex++ : cardIndex--
    handleChevVisibility()
}

const instantiateObserver = () => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const element = entry.target
                const isVisible = entry.isIntersecting
                const isFocused = element.classList.contains('focused')
                const isUnfocused = element.classList.contains('unfocused')

                if (isVisible && isUnfocused) {
                    element.classList.remove('unfocused')
                    element.classList.add('focused')
                } else if (!isVisible && isFocused) {
                    element.classList.remove('focused')
                    element.classList.add('unfocused')
                }
            })
        },
        {
            root: null,
            threshold: 0.9,
        }
    )
}

const setupCardsAndListeners = () => {
    cards = document.querySelectorAll('.card')
    container = document.querySelector('#container')
    const chevrons = document.querySelectorAll('.chev')

    cards.forEach((element) => {
        element.classList.add('unfocused')
    })

    instantiateObserver()
    cards.forEach((card) => observer.observe(card))

    // Listen for scroll event
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            handleCardTransition(event)
        }
    })
    container.addEventListener('wheel', handleCardTransition)
    chevrons.forEach((chev) => {
        chev.addEventListener('click', handleCardTransition)
    })
}

const handleChevVisibility = () => {
    const nextCard = cards[cardIndex + 1] ?? null
    const prevCard = cards[cardIndex - 1] ?? null
    const prevChev = document.querySelector('#prev-chev')
    const nextChev = document.querySelector('#next-chev')
    const isWeb = window.innerWidth > MOBILE_BREAKPOINT
    prevChev.classList.remove('fade-in', 'fade-out')
    nextChev.classList.remove('fade-in', 'fade-out')
    const prevChevShouldBeVisible = cardIndex !== 0
    const nextChevShouldBeVisible = cardIndex !== cards.length - 1
    const nextChevText = isWeb ? nextCard?.id.replace('card-', '') + ' >' : '>'
    const prevChevText = isWeb ? '< ' + prevCard?.id.replace('card-', '') : '<'
    // change chev text
    setTimeout(() => {
        nextChev.innerText = nextChevShouldBeVisible ? nextChevText : ''
        prevChev.innerText = prevChevShouldBeVisible ? prevChevText : ''
    }, CARD_TRANSITION_DURATION)
    // Handle initial load visibility
    if (initialLoad) {
        nextChev.classList.add('visible', 'fade-in')
        return
    }
    // Handle chevron visibility
    handleClassVisibility(prevChev, prevChevShouldBeVisible)
    handleClassVisibility(nextChev, nextChevShouldBeVisible)

    // once the fade out animation is complete, remove the classList
    handleAnimationEnd(prevChev, prevChevShouldBeVisible)
    handleAnimationEnd(nextChev, nextChevShouldBeVisible)
}

export const smoothScrollTo = (targetPosition) => {
    const duration = CARD_TRANSITION_DURATION
    const startPosition = container.scrollLeft
    const distance = targetPosition - startPosition
    let startTime = null

    const animationStep = (currentTime) => {
        if (startTime === null) {
            startTime = currentTime
        }

        const elapsedTime = currentTime - startTime
        const scrollValue = easeInOutQuad(
            elapsedTime,
            startPosition,
            distance,
            duration
        )

        container.scrollLeft = scrollValue

        if (elapsedTime < duration) {
            requestAnimationFrame(animationStep)
        } else {
            isScrolling = false
        }
    }

    requestAnimationFrame(animationStep)
}

document.addEventListener('DOMContentLoaded', async () => {
    await triggerInitialOverlay()
    setupCardsAndListeners()
    handleChevVisibility()
    initialLoad = false
})
