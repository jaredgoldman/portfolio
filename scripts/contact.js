import { request } from './utils.js'

/**
 * Load contact form, listen for submissions and display confirmation/error message after submit
 */
export const loadContact = () => {
    const form = document.getElementById('contact')
    const nameInput = document.getElementById('contact-name')
    const emailInput = document.getElementById('contact-email')
    const messageInput = document.getElementById('contact-message')
    const confirmation = document.getElementById('confirmation')

    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        
        // Clear any existing content in confirmation
        confirmation.innerHTML = ''
        
        // Create icon element
        const iconElement = document.createElement('div')
        iconElement.className = 'confirmation-icon'
        
        // Create message element
        const messageElement = document.createElement('div')
        messageElement.className = 'confirmation-message'
        
        // Create back button
        const backButton = document.createElement('button')
        backButton.className = 'back-button'
        backButton.textContent = 'Send Another Message'
        backButton.addEventListener('click', () => {
            // Reset form fields
            form.reset()
            
            // Hide confirmation and show form again
            confirmation.classList.remove('visible')
            form.classList.add('visible')
        })
        
        // Get form data
        const name = nameInput.value
        const email = emailInput.value
        const message = messageInput.value
        const referrer = 'dev'
        
        try {
            // Send the request
            const res = await request('/contact', 'POST', {
                name,
                email,
                message,
                referrer,
            })
            
            if (res?.accepted?.length) {
                // Success message
                iconElement.classList.add('success')
                messageElement.textContent = "I've got your message! Thanks for reaching out. I'll respond as soon as possible!"
            } else {
                // Error message
                iconElement.classList.add('error')
                messageElement.textContent = 'Message failed to send, please try again later'
            }
        } catch (error) {
            // Error handling
            iconElement.classList.add('error')
            messageElement.textContent = 'An error occurred. Please try again later.'
        }
        
        // Add elements to confirmation container
        confirmation.appendChild(iconElement)
        confirmation.appendChild(messageElement)
        confirmation.appendChild(backButton)
        
        // Show confirmation and hide form
        form.classList.remove('visible')
        confirmation.classList.add('visible')
    })
}
