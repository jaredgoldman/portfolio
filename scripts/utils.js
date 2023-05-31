// import { API_KEY, API_URL } from '../config.js'

// export const request = async (path, method = 'GET', data = null) => {
//     const body = method !== 'GET' && data ? JSON.stringify(data) : null
//     const res = await fetch(`${API_URL}/api${path}`, {
//         headers: {
//             Authorization: `bearer ${API_KEY}`,
//         },
//         method,
//         body,
//     })
//     return await res.json()
// }

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
