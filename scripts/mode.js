import { updateConfig } from './particles.js'

const lightVars = {
    '--primary-background-color': 'white',
    '--secondary-background-color': 'gray',
    '--primary-color': 'black',
    '--secondary-color': '#6b705c',
    '--primary-border-color': 'black',
    '--primary-background-color-rgb': '255, 255, 255',
    '--primary-color-rgb': '0, 0, 0',
    '--secondary-color-rgb': '107, 112, 92',
    '--tertiary-color-rgb': '120, 120, 120'
}
const darkVars = {
    '--primary-background-color': 'black',
    '--secondary-background-color': 'transparent',
    '--primary-color': 'white',
    '--primary-border-color': 'white',
    '--secondary-color': '#fca311',
    '--primary-background-color-rgb': '0, 0, 0',
    '--primary-color-rgb': '255, 255, 255',
    '--secondary-color-rgb': '252, 163, 17',
    '--tertiary-color-rgb': '145, 145, 144'
}

/**
 * Check if system prefers dark mode
 */
const prefersDarkMode = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply mode based on preference
 */
const applyMode = (isDark, cardContent, initialStyle) => {
    const mode = isDark ? 'dark' : 'light';
    const vars = isDark ? darkVars : lightVars;
    handleGradientModeChange(mode, cardContent, initialStyle);
    Object.entries(vars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
    updateConfig(mode);
}

/**
 * Apply dark/light mode on toggle and listen for system preference changes
 */
export const loadMode = () => {
    const input = document.querySelector('#mode-checkbox')
    const cardContent = document.querySelector('.card-content_right')
    const initialStyle = { ...cardContent.style }
    
    // Set initial state based on system preference
    const systemPrefersDark = prefersDarkMode();
    input.checked = !systemPrefersDark; // Checkbox is checked for light mode
    applyMode(systemPrefersDark, cardContent, initialStyle);
    
    // Listen for toggle changes
    input.addEventListener('change', () => {
        const isDark = !input.checked;
        applyMode(isDark, cardContent, initialStyle);
    })
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newPrefersDark = e.matches;
        input.checked = !newPrefersDark; // Update checkbox state
        applyMode(newPrefersDark, cardContent, initialStyle);
    });
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
