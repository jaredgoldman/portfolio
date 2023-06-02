import { triggerInitialOverlay } from './overlay.js'

let observer
let cards
let container
let isScrolling = false

const handleCardTransition = (event) => {
    event.preventDefault()
    if (isScrolling) return
    let scrollDirection
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

    // Define the distance to move the elements
    const moveDistance = cardDistance

    // Determine the current scroll position
    const currentScrollPosition = container.scrollLeft

    // Calculate the target scroll position
    const targetScrollPosition =
        currentScrollPosition + moveDistance * scrollDirection

    // Smoothly scroll the container
    smoothScrollTo(targetScrollPosition)
    isScrolling = true
}

const smoothScrollTo = (targetPosition) => {
    const duration = 350
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

// Thank you stackoverflow: https://stackoverflow.com/questions/13462001/ease-in-and-ease-out-animation-formula
const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
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

const setupCards = () => {
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

document.addEventListener('DOMContentLoaded', async () => {
    triggerInitialOverlay()
    setupCards()
})
