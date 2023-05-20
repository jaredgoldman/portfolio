let observer
let cards
let container

const handleWheelEvent = (event) => {
    event.preventDefault()
    // Calculate the scroll direction
    const scrollDirection = Math.sign(event.deltaY)

    // disable scrolling right on the last card
    if (
        scrollDirection === 1 &&
        cards[cards.length - 1].classList.contains('focused')
    ) {
        return
    }
    // find distance to the next card
    const cardWidth = cards[0].offsetWidth
    const cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight)
    const cardDistance = cardWidth + cardMargin
    // Define the distance to move the elements
    const moveDistance = cardDistance // Adjust this value as needed

    // Determine the current scroll position
    const currentScrollPosition = container.scrollLeft

    // Calculate the target scroll position
    const targetScrollPosition =
        currentScrollPosition + moveDistance * scrollDirection

    // Smoothly scroll the container
    smoothScrollTo(targetScrollPosition)
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

document.addEventListener('DOMContentLoaded', () => {
    cards = document.querySelectorAll('.card')
    cards.forEach((element) => {
        element.classList.add('unfocused')
    })
    instantiateObserver()
    cards.forEach((card) => observer.observe(card))

    container = document.querySelector('.container')
    container.addEventListener('wheel', handleWheelEvent)
})
