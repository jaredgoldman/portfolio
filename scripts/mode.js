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

    input.addEventListener('change', () => {
        const vars = input.checked ? lightVars : darkVars
        Object.entries(vars).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value)
        })
    })
})
