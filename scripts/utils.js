import { API_KEY, API_URL } from '../config.js'

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
