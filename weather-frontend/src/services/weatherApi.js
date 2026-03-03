const BASE = "/api"

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        credentials: "include"
    })

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
    }

    return res.json()
}

export const weatherApi = {
    current: (location) =>
        request(`/weather/current?location=${location}`),

    forecast: (location) =>
        request(`/weather/forecast?location=${location}`),

    history: () =>
        request("/history"),

    favorites: () =>
        request("/favorites")
}