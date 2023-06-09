import { API_KEY, API_URL } from '../config.js'
import { CARD_TRANSITION_DURATION } from '../constants.js'

export const request = async (path, method = 'GET', data = null) => {
    const body = method !== 'GET' && data ? JSON.stringify(data) : null
    const res = await fetch(`${API_URL}/api${path}`, {
        headers: {
            Authorization: `bearer ${API_KEY}`,
        },
        method,
        body,
    })
    return await res.json()
}

export const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

export const wait = async (duration) => {
    await new Promise((res) => {
        setTimeout(res, duration)
    })
}

// Thank you stackoverflow: https://stackoverflow.com/questions/13462001/ease-in-and-ease-out-animation-formula
export const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
}

export const handleClassVisibility = (element, shouldBeVisible) => {
    element.classList.remove('fade-in', 'fade-out')
    if (shouldBeVisible && !element.classList.contains('visible')) {
        element.classList.add('visible', 'fade-in')
    } else if (!shouldBeVisible && element.classList.contains('visible')) {
        element.classList.add('fade-out')
    }
}

export const handleAnimationEnd = (element, shouldBeVisible) => {
    element.addEventListener('animationend', () => {
        if (!shouldBeVisible) {
            element.classList.remove('visible')
        } else {
            element.classList.add('visible')
        }
    })
}
