import Card from "./Card";

function formatTemperature(value) {
    return value != null ? `${Math.round(value)}°` : "—";
}

function formatWind(value) {
    return value != null ? `${Math.round(value)} km/h` : "—";
}

function formatHumidity(value) {
    return value != null ? `${Math.round(value)}%` : "—";
}

export default function CurrentWeatherCard({ currentQ }) {
    const weather = currentQ.data;

    if (currentQ.isLoading) {
        return (
            <Card title="Current">
                <div className="muted">Loading…</div>
            </Card>
        );
    }

    if (currentQ.isError) {
        return (
            <Card title="Current">
                <div className="error">
                    Error: {String(currentQ.error?.message || currentQ.error)}
                </div>
            </Card>
        );
    }

    if (!weather) {
        return <Card title="Current" />;
    }

    return (
        <Card title="Current">
            <div className="city">{weather.city}</div>
            <div className="desc">{weather.condition}</div>

            <div className="tempRow">
                <div className="temp">{formatTemperature(weather.temp_c)}</div>

                <div className="meta">
                    <div>
                        Feels like: <b>{formatTemperature(weather.feelslike_c)}</b>
                    </div>
                    <div>
                        Wind: <b>{formatWind(weather.wind_kph)}</b>
                    </div>
                </div>
            </div>

            <div className="stats">
                <div className="stat">
                    <div className="statLabel">Humidity</div>
                    <div className="statValue">{formatHumidity(weather.humidity)}</div>
                </div>

                <div className="stat">
                    <div className="statLabel">Condition</div>
                    <div className="statValue">{weather.condition}</div>
                </div>
            </div>
        </Card>
    );
}
