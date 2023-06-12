import { request } from './utils.js'

document.addEventListener('DOMContentLoaded', async () => {
    const {
        data: {
            attributes: { text },
        },
    } = await request('/portfolio-bio')
    const { data: recommendations } = await request('/recommendations')
    const cardLeft = document.querySelector('#card-content_left')
    const bio = document.querySelector('#bio')
    const reccomendationsEl = document.querySelector('#recommendations')
    const reccoHeading = document.createElement('h2')
    reccoHeading.classList.add('recommendations-heading')
    reccoHeading.innerHTML = 'Recommendations'
    reccomendationsEl.appendChild(reccoHeading)
    recommendations.forEach((recco) => {
        reccomendationsEl.appendChild(createRecommendation(recco.attributes))
    })
    bio.innerHTML = text

    // Ensure we can scroll the bio
    cardLeft.addEventListener('wheel', (e) => {
        e.stopPropagation()
    })
})

const createRecommendation = ({
    recommender,
    relationship,
    recommendation,
}) => {
    const reccoEl = document.createElement('div')
    reccoEl.classList.add('recommendation')
    const reccoTitle = document.createElement('h3')
    reccoTitle.classList.add('recommendation-title')
    reccoTitle.innerHTML = `${recommender} - ${relationship}`
    const recco = document.createElement('p')
    recco.innerHTML = recommendation
    reccoEl.appendChild(reccoTitle)
    reccoEl.appendChild(recco)
    return reccoEl
}
