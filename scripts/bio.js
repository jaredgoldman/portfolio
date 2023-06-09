import { request } from './utils.js'

document.addEventListener('DOMContentLoaded', async () => {
    const {
        data: {
            attributes: { text },
        },
    } = await request('/portfolio-bio')
    const bio = document.querySelector('#bio')
    bio.innerHTML = text
    bio.addEventListener('wheel', (e) => {
        e.stopPropagation()
    })
})
