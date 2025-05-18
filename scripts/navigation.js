import { closeModal } from './projects.js'
import { areProjectsLoaded } from './projects.js'
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

// Simplify base path to empty string for local development
const basePath = '';

// Touch variables
let startX
let endX

/**
 * @param {Event} event - event object
 * Main function for handling card navigation
 */
const handleCardTransition = (event) => {
    if (isScrolling) return

    const scrollDirection = determineScrollDirection(event)
    if (!canTransition(event, scrollDirection)) return

    // Calculate the new card index before scrolling
    const newCardIndex = cardIndex + scrollDirection

    // Ensure index is within bounds
    if (newCardIndex < 0 || newCardIndex >= cards.length) return

    // find distance to the next card
    const targetScrollPosition = determineTargetScrollPosition(scrollDirection)

    // Update the card index
    cardIndex = newCardIndex

    // Smoothly scroll the container
    smoothScrollTo(targetScrollPosition)

    // Update UI and URL
    handleChevVisibility()
    updateUrlHash()
}

/**
 * Updates the URL path based on the current card index (without # prefix)
 */
const updateUrlHash = () => {
    if (!cards || !cards[cardIndex]) return

    const cardId = cards[cardIndex].id
    const section = cardId.replace('card-', '')

    // Use a safer approach for handling paths
    try {
        // Use simple hash navigation instead of path for better compatibility
        history.pushState({section}, document.title, `#${section}`)
    } catch (e) {
        // Fallback to hash if pushState not supported
        window.location.hash = section
    }
}

/**
 * Calculate target position for a specific card index
 * @param {Number} index - The card index to calculate position for
 * @returns {Number} - The target scroll position
 */
const calculateCardPosition = (index) => {
    if (!cards || !cards[index]) return 0

    // Ensure we're calculating based on actual card position
    const cardWidth = cards[index].offsetWidth
    const cardMarginRight = parseInt(getComputedStyle(cards[index]).marginRight)
    const cardMarginLeft = parseInt(getComputedStyle(cards[index]).marginLeft)

    // Use precise calculation based on actual position, not just multiplying by index
    let position = 0
    for (let i = 0; i < index; i++) {
        const width = cards[i].offsetWidth
        const marginRight = parseInt(getComputedStyle(cards[i]).marginRight)
        const marginLeft = parseInt(getComputedStyle(cards[i]).marginLeft)
        position += width + marginRight + marginLeft
    }

    return position
}

/**
 * Navigate to the section specified in the URL
 * (supports both path and hash-based navigation)
 */
const navigateToHashSection = () => {
    if (!cards || !container) return

    // First check pathname (for clean URLs)
    let targetSection = getSectionFromPath()

    // If no pathname, check hash
    if (!targetSection && window.location.hash) {
        targetSection = window.location.hash.substring(1)

        // If we found a section in the hash, update URL to use clean path
        if (targetSection) {
            try {
                history.replaceState(null, document.title, `/${targetSection}`)
            } catch (e) {
                // Continue with hash if replaceState fails
            }
        }
    }

    if (!targetSection) {
        // If no section identified, default to first card
        cardIndex = 0
        smoothScrollTo(0)
        handleChevVisibility()
        return
    }

    const targetCard = Array.from(cards).find(
        (card) => card.id === `card-${targetSection}`
    )

    if (targetCard) {
        const targetIndex = Array.from(cards).indexOf(targetCard)
        if (targetIndex !== cardIndex) {
            // Immediately update the card index
            cardIndex = targetIndex

            // Calculate precise target position for the card
            const targetPosition = calculateCardPosition(targetIndex)

            // Smoothly scroll to the exact position
            smoothScrollTo(targetPosition)
            handleChevVisibility()
        }
    } else {
        // If the section doesn't match any card, default to first card
        cardIndex = 0
        smoothScrollTo(0)
        handleChevVisibility()
        updateUrlHash() // Update URL to reflect actual position
    }
}

/**
 * @event {Number} scrollDirection - 1 or -1
 * @returns {Boolean} - true if the card can transition
 */
const determineTargetScrollPosition = (scrollDirection) => {
    // Calculate the next card index
    const nextCardIndex = cardIndex + scrollDirection

    // Use our precise calculation method
    if (nextCardIndex >= 0 && nextCardIndex < cards.length) {
        return calculateCardPosition(nextCardIndex)
    } else {
        // Fallback to old method if somehow we're out of bounds
        const cardDistance = getCardDistance()
        const scrollDistance = Math.max(cardDistance, window.innerWidth)
        const currentScrollPosition = container.scrollLeft
        return Math.round(
            currentScrollPosition + scrollDistance * scrollDirection
        )
    }
}

/**
 * Calculate current width of each card
 * @returns {Number} - width of each card
 */
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

/**
 * Considering characteristics of the event, determine the scrool direction
 * @param {Event} event - event object
 */
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

/**
 * Check if we can allow a horizontal card transition
 * @param {Event} event - event object
 * @param {Number} scrollDirection - 1 or -1
 */
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

/**
 * Instantitiate observer to add focuses/ufocused classes to scale cards
 * on scroll
 */
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

/**
 * Get the section name from the current path
 * This handles cases where the site might be in a subdirectory
 */
const getSectionFromPath = () => {
    // Check hash first as it's more reliable
    if (window.location.hash) {
        return window.location.hash.substring(1);
    }
    
    const path = window.location.pathname;
    
    // If we're at the root or just a slash, no section
    if (path === '/' || path === '') {
        return '';
    }

    // Get the last segment of the path (which should be our section)
    const pathSegments = path.split('/').filter((segment) => segment.length > 0);

    if (pathSegments.length === 0) {
        return '';
    }

    // The last non-empty segment should be our section
    return pathSegments[pathSegments.length - 1];
}

/**
 * Initialize navigation based on current URL path or hash
 */
const initializeFromUrl = () => {
    // First try to get section from path (excluding leading slash)
    let targetSection = ''

    console.log('Initializing navigation from URL:', {
        path: window.location.pathname,
        hash: window.location.hash,
        cards: cards ? cards.length : 0,
        container: !!container,
    })

    // Try to get section from path first
    targetSection = getSectionFromPath()

    if (targetSection) {
        console.log('Found section from path:', targetSection)
    } else if (window.location.hash) {
        // Fall back to hash if no path
        targetSection = window.location.hash.substring(1)
        console.log('Found section from hash:', targetSection)

        // Update URL to use clean path instead of hash
        try {
            // Use a simpler path construction that's more resilient in development
            history.replaceState(null, document.title, `/${targetSection}`)
        } catch (e) {
            // Continue with hash if replaceState fails
            console.warn('Could not update URL path:', e)
        }
    }

    if (!targetSection) {
        console.log('No target section found in URL')
        return false
    }

    if (!cards || !container) {
        console.warn('Cards or container not ready yet')
        return false
    }

    // Check if we're loading to the projects section
    const isProjectsSection = targetSection === 'projects';
    
    // If we're loading to projects section and projects aren't loaded yet, 
    // keep the loader visible
    if (isProjectsSection && !areProjectsLoaded()) {
        console.log('Loading projects section, waiting for projects to load');
        // Keep the loader overlay visible
        const loaderOverlay = document.querySelector('.loader-overlay');
        if (loaderOverlay) {
            loaderOverlay.style.animation = 'none';
            loaderOverlay.style.opacity = '1';
            
            // Set up an interval to check when projects are loaded
            const checkProjectsLoaded = setInterval(() => {
                if (areProjectsLoaded()) {
                    // Once projects are loaded, fade out the loader
                    loaderOverlay.style.animation = 'fadeOut 1.25s ease-in-out forwards';
                    clearInterval(checkProjectsLoaded);
                }
            }, 100);
        }
    }

    console.log('Looking for card with ID:', `card-${targetSection}`)
    const targetCard = Array.from(cards).find(
        (card) => card.id === `card-${targetSection}`
    )

    if (targetCard) {
        console.log('Found matching card:', targetCard.id)
        const targetIndex = Array.from(cards).indexOf(targetCard)

        // Update card index
        cardIndex = targetIndex
        console.log('Set cardIndex to:', cardIndex)

        // Calculate position and scroll there immediately
        const position = calculateCardPosition(targetIndex)
        console.log('Calculated scroll position:', position)
        container.scrollLeft = position

        // Update UI
        handleChevVisibility()
        return true
    } else {
        console.warn('No matching card found for section:', targetSection)
        console.log(
            'Available cards:',
            Array.from(cards).map((card) => card.id)
        )
        return false
    }
}

/**
 * Instaniate intersections observer and add listeners to handle card transitions
 */
const setupCardsAndListeners = () => {
    console.log('Setting up cards and listeners')
    cards = document.querySelectorAll('.card')
    container = document.querySelector('#container')
    const chevrons = document.querySelectorAll('.chev')

    console.log('Found cards:', cards ? cards.length : 0)
    console.log('Found container:', !!container)

    cards.forEach((element) => {
        element.classList.add('unfocused')
    })

    // Add delay setting up observer so focused animation
    // triggers after loader is done
    setTimeout(() => {
        instantiateObserver()
        cards.forEach((card) => observer.observe(card))
    }, 1250)

    // Set up interactions listeners
    container.addEventListener('wheel', handleCardTransition)
    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            handleCardTransition(event)
        }
    })
    chevrons.forEach((chev) => {
        chev.addEventListener('click', handleCardTransition)
    })
    // store initial start touch state to calculate swipe direction
    document.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX
    })
    document.addEventListener('touchend', handleCardTransition)

    // Listen for popstate (history back/forward navigation)
    window.addEventListener('popstate', () => {
        console.log('Popstate event triggered')
        navigateToHashSection()
    })

    // Handle hash changes (for older browsers)
    window.addEventListener('hashchange', () => {
        console.log('Hash change event triggered')
        // Convert hash navigation to path navigation
        if (window.location.hash) {
            const section = window.location.hash.substring(1)
            try {
                // Use simpler path approach
                history.replaceState(null, document.title, `/${section}`)
                navigateToHashSection()
            } catch (e) {
                // Fallback if replaceState fails
                console.warn('Could not replace state:', e)
                navigateToHashSection()
            }
        }
    })
}

/**
 * Handle window resize
 * TODO: figure out how to re-center to current card
 */
const handleResize = () => {
    setIsWeb()
    const modal = document.querySelector('#project-modal')
    // If we're not on the first card already, just scroll back to the beginning
    if (cardIndex > 0 || container.scrollLeft > 0) {
        if (modal && modal.open) closeModal()
        smoothScrollTo(0)
        cardIndex = 0
    }
    handleChevVisibility()
}

/**
 * handle visibility of naviation chevrons depending on card index
 * and viewport size
 */
const handleChevVisibility = () => {
    const nextCard = cards[cardIndex + 1] ?? null
    const prevCard = cards[cardIndex - 1] ?? null
    const prevChev = document.querySelector('#prev-chev')
    const nextChev = document.querySelector('#next-chev')

    prevChev.classList.remove('fade-in', 'fade-out', 'visible')
    nextChev.classList.remove('fade-in', 'fade-out', 'visible')

    const prevChevShouldBeVisible = cardIndex !== 0
    const nextChevShouldBeVisible = cardIndex !== cards.length - 1
    const nextChevText = isResponsive
        ? `<span class="chev-section">${nextCard?.id.replace('card-', '')}</span><span class="chev-arrow" aria-hidden="true">›</span>`
        : '<span class="chev-arrow" aria-hidden="true">›</span>'
    const prevChevText = isResponsive
        ? `<span class="chev-arrow" aria-hidden="true">‹</span><span class="chev-section">${prevCard?.id.replace('card-', '')}</span>`
        : '<span class="chev-arrow" aria-hidden="true">‹</span>'

    // change chev text and clear if should be hidden
    setTimeout(() => {
        if (nextChevShouldBeVisible) {
            nextChev.innerHTML = nextChevText
        } else {
            nextChev.innerHTML = ''
            nextChev.classList.remove('visible')
        }
        
        if (prevChevShouldBeVisible) {
            prevChev.innerHTML = prevChevText
        } else {
            prevChev.innerHTML = ''
            prevChev.classList.remove('visible')
        }
    }, CARD_TRANSITION_DURATION)

    // Handle initial load visibility
    if (initialLoad) {
        if (nextChevShouldBeVisible) {
            nextChev.classList.add('visible', 'fade-in')
        }
        if (prevChevShouldBeVisible) {
            prevChev.classList.add('visible', 'fade-in')
        }
        return
    }

    // Handle chevron visibility
    handleClassVisibility(prevChev, prevChevShouldBeVisible)
    handleClassVisibility(nextChev, nextChevShouldBeVisible)

    // once the fade out animation is complete, remove the classList
    handleAnimationEnd(prevChev, prevChevShouldBeVisible)
    handleAnimationEnd(nextChev, nextChevShouldBeVisible)
}

/**
 * Utilze quadratic util function to scroll horizontaly through cards
 * @param {targetPosition} targetPosition - target scroll position in px
 */
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

/**
 * Navigate to a specific section by name
 * @param {string} sectionName - Section name to navigate to (without 'card-' prefix)
 */
export const navigateToSection = (sectionName) => {
    if (!sectionName || !cards || !container) return false

    const targetCard = Array.from(cards).find(
        (card) => card.id === `card-${sectionName}`
    )

    if (targetCard) {
        try {
            // Use hash-based navigation for simplicity and better compatibility
            history.pushState({section: sectionName}, document.title, `#${sectionName}`)

            // Manually navigate to the section
            const targetIndex = Array.from(cards).indexOf(targetCard)
            cardIndex = targetIndex

            // Calculate precise position of the target card
            const targetPosition = calculateCardPosition(targetIndex)

            // Scroll to that position
            smoothScrollTo(targetPosition)
            handleChevVisibility()
            return true
        } catch (e) {
            // Fallback to hash if pushState fails
            window.location.hash = sectionName
            return true
        }
    }

    return false
}

export const loadNavigation = async () => {
    setIsWeb()
    setupCardsAndListeners()

    // Handle initial URL path/hash navigation with a delay
    // to ensure everything is loaded first
    setTimeout(() => {
        // Try to navigate based on URL
        const navigated = initializeFromUrl()

        // If we weren't able to navigate based on URL, set up default view
        if (!navigated) {
            handleChevVisibility()
        }

        initialLoad = false
    }, 1500)
}
