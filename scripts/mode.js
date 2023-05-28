const lightVars = {
    '--primary-background-color': 'white',
    '--primary-color': 'black',
    '--primary-border-color': 'black',
    '--secondary-color': '#ccc',
}
const darkVars = {
    '--primary-background-color': 'black',
    '--primary-color': 'white',
    '--primary-border-color': 'white',
    '--secondary-color': '#ccc',
}

document.addEventListener('DOMContentLoaded', () => {
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
    })
})

const handleGradientModeChange = (mode, cardContent, initialStyle) => {
    cardContent.style.transitionDelay = '0.5s'
    if (mode === 'light') {
        cardContent.style.backgroundImage = 'url(../assets/jg_kid_cropped.jpg)'
        cardContent.style.backgroundSize = 'contain'
        cardContent.style.backgroundPosition = 'center'
    } else {
        applyPreviousStyle(initialStyle, cardContent)
    }
}

const applyPreviousStyle = (prevStyle, element) => {
    for (let property in prevStyle) {
        element.style[property] = prevStyle[property]
    }
}
