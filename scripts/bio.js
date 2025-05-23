import { request } from './utils.js'

/**
 * @param {Object} recommendation - recommendation object
 * @param {String} recommendation.recommender - name of recommender
 * @param {String} recommendation.relationship - relationship to recommender
 * @returns {HTMLElement} - recommendation element
 * Load individual recommendations
 */
const createRecommendation = ({
    recommender,
    relationship,
    recommendation,
    linkedIn,
}) => {
    const reccoEl = document.createElement('div')
    reccoEl.classList.add('recommendation')

    const reccoTitle = document.createElement('div')
    reccoTitle.classList.add('recommendation-title')

    const nameDiv = document.createElement('div')
    nameDiv.classList.add('recommender')
    if (linkedIn) {
        const reccoLink = document.createElement('a')
        reccoLink.href = linkedIn
        reccoLink.target = '_blank'
        reccoLink.innerText = recommender
        nameDiv.appendChild(reccoLink)
    } else {
        nameDiv.innerText = recommender
    }

    const relationshipDiv = document.createElement('div')
    relationshipDiv.classList.add('relationship')
    relationshipDiv.innerText = relationship

    const recco = document.createElement('p')
    recco.innerHTML = recommendation

    reccoTitle.appendChild(nameDiv)
    reccoTitle.appendChild(relationshipDiv)
    reccoEl.appendChild(reccoTitle)
    reccoEl.appendChild(recco)
    return reccoEl
}

export const loadBio = async () => {
    const {
        data: {
            attributes: { text },
        },
    } = await request('/portfolio-bio')
    const { data: recommendations } = await request('/recommendations')
    const contentLeft = document.querySelector('#card-content_left')
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
    contentLeft.addEventListener('wheel', (e) => {
        e.stopPropagation()
    })
}
