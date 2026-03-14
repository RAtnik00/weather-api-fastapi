export function formatTemperature(value) {
    return value != null ? `${Math.round(value)}°` : "—";
}

export function formatWind(value) {
    return value != null ? `${Math.round(value)} km/h` : "—";
}

export function formatHumidity(value) {
    return value != null ? `${Math.round(value)}%` : "—";
}

export function formatForecastDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    if (isToday) {
        return "Today";
    }

    return date.toLocaleDateString("en-US", { weekday: "long" });
}