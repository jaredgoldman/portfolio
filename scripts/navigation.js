import { triggerInitialOverlay } from './overlay.js'
import { closeModal } from './projects.js'
import {
    easeInOutQuad,
    handleClassVisibility,
    handleAnimationEnd,
} from './utils.js'
import {
    CARD_TRANSITION_DURATION,
    RESPONSIVE_BREAKPOINT,
    MIN_SWIPE_DISTANCE,
} from '../constants.js'

let isResponsive = true
let observer
let cards
let container
let cardIndex = 0
let initialLoad = true
export let isScrolling = false

// Touch variables
let startX
let endX

const handleCardTransition = (event) => {
    if (isScrolling) return

    const scrollDirection = determineScrollDirection(event)
    if (!canTransition(event, scrollDirection)) return

    // find distance to the next card
    const targetScrollPosition = determineTargetScrollPosition(scrollDirection)
    // Smoothly scroll the container
    smoothScrollTo(targetScrollPosition)

    // Update the card index
    scrollDirection === 1 ? cardIndex++ : cardIndex--
    handleChevVisibility()
}

const determineTargetScrollPosition = (scrollDirection) => {
    const cardDistance = getCardDistance()
    const scrollDistance = Math.max(cardDistance, window.innerWidth)
    const currentScrollPosition = container.scrollLeft

    return Math.round(currentScrollPosition + scrollDistance * scrollDirection)
}

const getCardDistance = () => {
    const cardWidth = cards[0].offsetWidth
    const cardMarginRight = parseInt(
        window.getComputedStyle(cards[0]).marginRight
    )
    const cardMarginLeft = parseInt(
        window.getComputedStyle(cards[0]).marginLeft
    )
    return cardWidth + cardMarginRight + cardMarginLeft
}

const determineScrollDirection = (event) => {
    let scrollDirection = 0
    // Handle keyboard events
    if (event.type === 'keydown') {
        event.key === 'ArrowRight'
            ? (scrollDirection = 1)
            : (scrollDirection = -1)
        // Handle scroll events
    } else if (event.type === 'wheel') {
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
        // Handle click and touch on nav button events
    } else if (
        event.target.id === 'next-chev' ||
        event.target.id === 'prev-chev'
    ) {
        scrollDirection = event.target.id === 'next-chev' ? 1 : -1
        // We know
        return scrollDirection
        // Handle mobile swipe
    } else if (event.type === 'touchend') {
        endX = event.changedTouches[0].clientX

        const deltaX = endX - startX

        if (Math.abs(deltaX) >= MIN_SWIPE_DISTANCE) {
            if (deltaX > 0) {
                scrollDirection = -1
            } else {
                scrollDirection = 1
            }
        } else {
            scrollDirection = 0
        }
    }
    return scrollDirection
}

const canTransition = (event, scrollDirection) => {
    if (!scrollDirection) return
    if (event.target.id === 'bio-inner') {
        return
    }
    // disable scrolling beyond first/last cards
    if (
        (scrollDirection === 1 &&
            cards[cards.length - 1].classList.contains('focused')) ||
        (scrollDirection === -1 && cards[0].classList.contains('focused'))
    ) {
        return
    }
    return true
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
            threshold: 0.6,
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
    window.addEventListener('resize', handleResize)
    document.addEventListener('touchstart', handleSwipeStart)
    document.addEventListener('touchend', handleCardTransition)
}

const handleSwipeStart = (event) => {
    startX = event.touches[0].clientX
}

const handleResize = () => {
    setIsWeb()
    const modal = document.querySelector('#project-modal')
    if (cardIndex > 0 || container.scrollLeft > 0) {
        if (modal.open) closeModal()
        smoothScrollTo(0)
        cardIndex = 0
    }
    handleChevVisibility()
}

const handleChevVisibility = () => {
    const nextCard = cards[cardIndex + 1] ?? null
    const prevCard = cards[cardIndex - 1] ?? null
    const prevChev = document.querySelector('#prev-chev')
    const nextChev = document.querySelector('#next-chev')

    prevChev.classList.remove('fade-in', 'fade-out')
    nextChev.classList.remove('fade-in', 'fade-out')

    const prevChevShouldBeVisible = cardIndex !== 0
    const nextChevShouldBeVisible = cardIndex !== cards.length - 1
    const nextChevText = isResponsive
        ? nextCard?.id.replace('card-', '') + '<br>' + ' >'
        : '>'
    const prevChevText = isResponsive
        ? prevCard?.id.replace('card-', '') + '<br>' + '<'
        : '<'

    // change chev text
    setTimeout(() => {
        nextChev.innerHTML = nextChevShouldBeVisible ? nextChevText : ''
        prevChev.innerHTML = prevChevShouldBeVisible ? prevChevText : ''
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

const smoothScrollTo = (targetPosition) => {
    isScrolling = true
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

const setIsWeb = () => {
    isResponsive = window.innerWidth > RESPONSIVE_BREAKPOINT ? true : false
}

export const loadNavigation = async () => {
    setIsWeb()
    await triggerInitialOverlay()
    setupCardsAndListeners()
    handleChevVisibility()
    initialLoad = false
}
