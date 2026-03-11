import api from "./apiClient";

export async function fetchCurrentWeather(city) {
    const { data } = await api.get("/weather/current", {
        params: { location: city },
    });

    return {
        city: data.city,
        temp_c: data.temp_c,
        feelslike_c: data.feels_like_c,
        condition: data.description,
        wind_kph: data.wind_speed,
        humidity: data.humidity ?? null,
    };
}

export async function fetchForecast(city) {
    const { data } = await api.get("/weather/forecast", {
        params: { location: city },
    });

    return {
        city: data.city,
        days: (data.days || []).map((d) => ({
            date: d.date,
            min_c: d.temp_min_c,
            max_c: d.temp_max_c,
            wind_kph: d.wind_speed_avg,
            condition: d.description,
        })),
    };
}

export async function fetchHistory() {
    const { data } = await api.get("/history");
    return data.history || [];
}

export async function fetchFavorites() {
    const { data } = await api.get("/favorites");
    return data.favorites || [];
}

export async function addFavorite(city) {
    const { data } = await api.post(`/favorites/${encodeURIComponent(city)}`);
    return data.favorites || [];
}

export async function removeFavorite(city) {
    const { data } = await api.delete(`/favorites/${encodeURIComponent(city)}`);
    return data.favorites || [];
}