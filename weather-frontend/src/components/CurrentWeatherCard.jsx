import Card from "./Card";

export default function CurrentWeatherCard({ currentQ }) {
    return (
        <Card title="Current">
            {currentQ.isLoading ? (
                <div className="muted">Loading…</div>
            ) : currentQ.isError ? (
                <div className="error">
                    Error: {String(currentQ.error?.message || currentQ.error)}
                </div>
            ) : currentQ.data ? (
                <>
                    <div className="city">{currentQ.data.city}</div>
                    <div className="desc">{currentQ.data.condition}</div>

                    <div className="tempRow">
                        <div className="temp">{Math.round(currentQ.data.temp_c)}°</div>
                        <div className="meta">
                            <div>
                                Feels like:{" "}
                                <b>
                                    {currentQ.data.feelslike_c != null
                                        ? `${Math.round(currentQ.data.feelslike_c)}°`
                                        : "—"}
                                </b>
                            </div>
                            <div>
                                Wind:{" "}
                                <b>
                                    {currentQ.data.wind_kph != null
                                        ? `${Math.round(currentQ.data.wind_kph)} km/h`
                                        : "—"}
                                </b>
                            </div>
                        </div>
                    </div>

                    <div className="stats">
                        <div className="stat">
                            <div className="statLabel">Humidity</div>
                            <div className="statValue">
                                {currentQ.data.humidity != null
                                    ? `${Math.round(currentQ.data.humidity)}%`
                                    : "—"}
                            </div>
                        </div>
                        <div className="stat">
                            <div className="statLabel">Condition</div>
                            <div className="statValue">{currentQ.data.condition}</div>
                        </div>
                    </div>
                </>
            ) : null}
        </Card>
    );
}