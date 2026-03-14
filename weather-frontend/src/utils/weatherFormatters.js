export function formatTemperature(value) {
    if (value == null) return "-";
    return `${Math.round(value)}°`;
}

export function formatWind(value) {
    if (value == null) return "-";
    return `${Math.round(value)} km/h`;
}

export function formatHumidity(value) {
    if (value == null) return "-";
    return `${Math.round(value)}%`;
}