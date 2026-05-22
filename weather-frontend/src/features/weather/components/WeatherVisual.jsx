const WEATHER_ICON_PATHS = {
    sun: (
        <>
            <circle className="weatherIconSunCore" cx="32" cy="32" r="11" />
            <path
                className="weatherIconSunRays"
                d="M32 8v7M32 49v7M8 32h7M49 32h7M15 15l5 5M44 44l5 5M49 15l-5 5M20 44l-5 5"
            />
        </>
    ),
    cloud: (
        <>
            <path
                className="weatherIconCloud"
                d="M19 43h29a10 10 0 0 0 0-20 15 15 0 0 0-29-4 12 12 0 0 0 0 24Z"
            />
        </>
    ),
    rain: (
        <>
            <path
                className="weatherIconCloud"
                d="M19 35h29a10 10 0 0 0 0-20 15 15 0 0 0-29-4 12 12 0 0 0 0 24Z"
            />
            <path className="weatherIconRain" d="M23 42l-4 9M34 42l-4 9M45 42l-4 9" />
        </>
    ),
    snow: (
        <>
            <path
                className="weatherIconCloud"
                d="M19 35h29a10 10 0 0 0 0-20 15 15 0 0 0-29-4 12 12 0 0 0 0 24Z"
            />
            <path className="weatherIconSnow" d="M23 47h.01M34 47h.01M45 47h.01" />
        </>
    ),
    storm: (
        <>
            <path
                className="weatherIconCloud"
                d="M19 34h29a10 10 0 0 0 0-20 15 15 0 0 0-29-4 12 12 0 0 0 0 24Z"
            />
            <path className="weatherIconStorm" d="M35 36l-8 13h8l-4 9 10-15h-8l4-7Z" />
        </>
    ),
    fog: (
        <>
            <path
                className="weatherIconCloud"
                d="M19 31h29a10 10 0 0 0 0-20 15 15 0 0 0-29-4 12 12 0 0 0 0 24Z"
            />
            <path className="weatherIconFog" d="M15 40h34M19 48h26M23 56h18" />
        </>
    ),
};

export default function WeatherVisual({ visual, size = "large" }) {
    const type = visual?.type ?? "cloud";
    const label = visual?.label ?? "Weather";
    const paths = WEATHER_ICON_PATHS[type] ?? WEATHER_ICON_PATHS.cloud;

    return (
        <div
            className={`weatherVisual weatherVisual-${size}`}
            aria-label={label}
            role="img"
        >
            <svg className="weatherVisualSvg" viewBox="0 0 64 64" aria-hidden="true">
                {paths}
            </svg>
        </div>
    );
}