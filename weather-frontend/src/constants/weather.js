export const DEFAULT_CITY = "Warsaw";

export const STORAGE_KEYS = {
    geoCacheConsent: "weather_geo_cache_consent",
    coords: "weather_coords",
};

export const DEFAULT_GEO_CACHE_CONSENT = "unset";

export const WEATHER_QUERY_KEYS = {
    currentByCity: (city) => ["weather", "current", city],
    currentByCoords: (lat, lon) => ["weather", "current", "coords", lat, lon],
    forecastByCity: (city) => ["weather", "forecast", city],
    forecastByCoords: (lat, lon) => ["weather", "forecast", "coords", lat, lon],
    history: () => ["weather", "history"],
    favorites: () => ["weather", "favorites"],
    citySuggestions: (query) => ["weather", "city-suggestions", query],
};
