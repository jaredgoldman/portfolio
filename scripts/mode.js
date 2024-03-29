import { updateConfig } from './particles.js'

const lightVars = {
    '--primary-background-color': 'white',
    '--secondary-background-color': 'gray',
    '--primary-color': 'black',
    '--secondary-color': '#6b705c',
    '--primary-border-color': 'black',
}
const darkVars = {
    '--primary-background-color': 'black',
    '--secondary-background-color': 'transparent',
    '--primary-color': 'white',
    '--primary-border-color': 'white',
    '--secondary-color': '#fca311',
}

/**
 * Apply dark/light mode on toggle
 */
export const loadMode = () => {
    const input = document.querySelector('#mode-checkbox')
    const cardContent = document.querySelector('.card-content_right')
    const initialStyle = { ...cardContent.style }

    input.addEventListener('change', () => {
        const mode = input.checked ? 'light' : 'dark'
        const vars = mode === 'dark' ? darkVars : lightVars
        handleGradientModeChange(mode, cardContent, initialStyle)
        Object.entries(vars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value)
        })
        updateConfig(mode)
    })
}

/**
 * Change about me picture css properties when we change to mode
 */
const handleGradientModeChange = (mode, cardContent, initialStyle) => {
    if (mode === 'light') {
        cardContent.style.backgroundImage = 'url(../assets/images/jg_ny.jpg)'
        cardContent.style.backgroundSize = 'contain'
        cardContent.style.backgroundPosition = 'center'
        cardContent.style.transform = 'translateY(-10%)'
    } else {
        applyPreviousStyle(initialStyle, cardContent)
    }
}

const applyPreviousStyle = (prevStyle, element) => {
    for (let property in prevStyle) {
        element.style[property] = prevStyle[property]
    }
}
