import api from "./apiClient";

function mapCurrentWeather(data) {
    return {
        city: data.city,
        temp_c: data.temp_c,
        feelslike_c: data.feels_like_c,
        condition: data.description,
        wind_kph: data.wind_speed,
        humidity: data.humidity ?? null,
    };
}

function mapForecastDay(day) {
    return {
        date: day.date,
        min_c: day.temp_min_c,
        max_c: day.temp_max_c,
        wind_kph: day.wind_speed_avg,
        condition: day.description,
    };
}

function mapForecast(data) {
    return {
        city: data.city,
        days: (data.days || []).map(mapForecastDay),
    };
}

function mapHistory(data) {
    return data.history || [];
}

function mapFavorites(data) {
    return data.favorites || [];
}

function mapCitySuggestion(item) {
    return {
        name: item.name,
        country: item.country,
        state: item.state ?? null,
        lat: item.lat ?? null,
        lon: item.lon ?? null,
    };
}

export async function fetchCurrentWeather(city) {
    const { data } = await api.get("/weather/current", {
        params: { location: city },
    });

    return mapCurrentWeather(data);
}

export async function fetchCurrentWeatherByCoords(lat, lon) {
    const { data } = await api.get("/weather/current/by-coords", {
        params: { lat, lon },
    });

    return mapCurrentWeather(data);
}

export async function fetchForecast(city) {
    const { data } = await api.get("/weather/forecast", {
        params: { location: city },
    });

    return mapForecast(data);
}

export async function fetchForecastByCoords(lat, lon) {
    const { data } = await api.get("/weather/forecast/by-coords", {
        params: { lat, lon },
    });

    return mapForecast(data);
}

export async function fetchHistory() {
    const { data } = await api.get("/history");
    return mapHistory(data);
}

export async function fetchFavorites() {
    const { data } = await api.get("/favorites");
    return mapFavorites(data);
}

export async function addFavorite(city) {
    const { data } = await api.post(`/favorites/${encodeURIComponent(city)}`);
    return mapFavorites(data);
}

export async function removeFavorite(city) {
    const { data } = await api.delete(`/favorites/${encodeURIComponent(city)}`);
    return mapFavorites(data);
}

export async function fetchCitySuggestions(query) {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
        return [];
    }

    const { data } = await api.get("/weather/cities", {
        params: { q: normalizedQuery, limit: 5 },
    });

    return Array.isArray(data) ? data.map(mapCitySuggestion) : [];
}