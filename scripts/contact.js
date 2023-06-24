import { request } from './utils.js'

export const loadContact = () => {
    const form = document.getElementById('contact')
    const nameInput = document.getElementById('contact-name')
    const emailInput = document.getElementById('contact-email')
    const messageInput = document.getElementById('contact-message')
    const confirmation = document.getElementById('confirmation')

    form.addEventListener('submit', async (event) => {
        let confirmationMessage =
            "I've got your message! Thanks for reaching out. I'll respond as soon as possible!"

        event.preventDefault()
        const name = nameInput.value
        const email = emailInput.value
        const message = messageInput.value
        const referrer = 'dev'
        const res = await request('/contact', 'POST', {
            name,
            email,
            message,
            referrer,
        })
        if (!res?.accepted?.length) {
            confirmationMessage =
                'Message failed to send, please try again later'
        }

        confirmation.innerText = confirmationMessage
        confirmation.style.color = 'red'
        form.classList.remove('visible')
        confirmation.classList.add('visible')
    })
}
