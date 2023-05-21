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
    const buttons = document.querySelectorAll('.radio')
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log(button.value)
            const vars = button.value === 'light' ? lightVars : darkVars
            Object.entries(vars).forEach(([key, value]) => {
                document.documentElement.style.setProperty(key, value)
            })
        })
    })
})
