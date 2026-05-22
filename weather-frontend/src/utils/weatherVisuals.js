const WEATHER_VISUALS = [
    {
        keywords: ["thunder", "storm"],
        type: "storm",
        label: "Storm",
    },
    {
        keywords: ["rain", "drizzle", "shower"],
        type: "rain",
        label: "Rain",
    },
    {
        keywords: ["snow", "sleet", "ice"],
        type: "snow",
        label: "Snow",
    },
    {
        keywords: ["mist", "fog", "haze", "smoke"],
        type: "fog",
        label: "Fog",
    },
    {
        keywords: ["cloud", "overcast"],
        type: "cloud",
        label: "Cloudy",
    },
    {
        keywords: ["clear", "sun"],
        type: "sun",
        label: "Clear",
    },
];

export function getWeatherVisual(condition) {
    const normalizedCondition = String(condition ?? "").toLowerCase();

    return (
        WEATHER_VISUALS.find((item) =>
            item.keywords.some((keyword) =>
                normalizedCondition.includes(keyword),
            ),
        ) ?? {
            type: "cloud",
            label: "Weather",
        }
    );
}