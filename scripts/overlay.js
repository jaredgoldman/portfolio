import { wait, asyncForEach } from './utils.js'
const showOverlay = false

export const triggerInitialOverlay = async () => {
    const overlay = document.querySelector('#overlay')
    const container = document.querySelector('#main')

    if (showOverlay) {
        container.style.display = 'none'
        const overlayText = 'Jared Goldman'
        const textArr = overlayText.split('')
        // Add chars
        textArr.forEach((letter) => {
            const el = document.createElement('span')
            el.classList.add('overlay-char')
            el.style.visibility = 'hidden'
            if (letter === ' ') letter = '\u00A0'
            el.innerText = letter
            overlay.appendChild(el)
        })
        // Fade in chars
        const overlayChars = document.querySelectorAll('.overlay-char')
        await asyncForEach(overlayChars, async (char) => {
            char.style.visibility = 'visible'
            char.classList.add('fade-in')
            await wait(25)
        })
        await wait(1000)
        // Fade out overlay
        overlay.classList.add('fade-out')
        await wait(500)
    }
    overlay.style.display = 'none'
    container.classList.add('fade-in')
    container.style.display = 'flex'
}
