import api from "./apiClient";

const STORAGE_KEYS = {
    history: "weather_history",
    favorites: "weather_favorites",
};

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

function mapCitySuggestion(item) {
    return {
        name: item.name,
        country: item.country,
        state: item.state ?? null,
        lat: item.lat ?? null,
        lon: item.lon ?? null,
    };
}

function readStoredList(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed
            .map((item) => String(item).trim())
            .filter(Boolean);
    } catch {
        return [];
    }
}

function writeStoredList(key, values) {
    const normalized = values
        .map((item) => String(item).trim())
        .filter(Boolean);

    localStorage.setItem(key, JSON.stringify(normalized));
}

function dedupeCaseInsensitive(items, limit) {
    const seen = new Set();
    const result = [];

    for (const item of items) {
        const normalized = String(item).trim();
        const compareKey = normalized.toLowerCase();

        if (!normalized || seen.has(compareKey)) {
            continue;
        }

        seen.add(compareKey);
        result.push(normalized);

        if (result.length >= limit) {
            break;
        }
    }

    return result;
}

function getHistoryList() {
    return readStoredList(STORAGE_KEYS.history);
}

function getFavoritesList() {
    return readStoredList(STORAGE_KEYS.favorites);
}

function saveHistoryList(items) {
    writeStoredList(STORAGE_KEYS.history, items);
}

function saveFavoritesList(items) {
    writeStoredList(STORAGE_KEYS.favorites, items);
}

function pushHistory(city) {
    const normalizedCity = String(city || "").trim();
    if (!normalizedCity) return getHistoryList();

    const nextHistory = dedupeCaseInsensitive(
        [normalizedCity, ...getHistoryList()],
        10
    );

    saveHistoryList(nextHistory);
    return nextHistory;
}

export async function fetchCurrentWeather(city) {
    const { data } = await api.get("/weather/current", {
        params: { location: city },
    });

    const mapped = mapCurrentWeather(data);
    pushHistory(mapped.city);
    return mapped;
}

export async function fetchCurrentWeatherByCoords(lat, lon) {
    const { data } = await api.get("/weather/current/by-coords", {
        params: { lat, lon },
    });

    const mapped = mapCurrentWeather(data);
    pushHistory(mapped.city);
    return mapped;
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
    return getHistoryList();
}

export async function fetchFavorites() {
    return getFavoritesList();
}

export async function addFavorite(city) {
    const normalizedCity = String(city || "").trim();
    if (!normalizedCity) {
        return getFavoritesList();
    }

    const nextFavorites = dedupeCaseInsensitive(
        [normalizedCity, ...getFavoritesList()],
        50
    );

    saveFavoritesList(nextFavorites);
    return nextFavorites;
}

export async function removeFavorite(city) {
    const normalizedCity = String(city || "").trim().toLowerCase();

    const nextFavorites = getFavoritesList().filter(
        (item) => item.trim().toLowerCase() !== normalizedCity
    );

    saveFavoritesList(nextFavorites);
    return nextFavorites;
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