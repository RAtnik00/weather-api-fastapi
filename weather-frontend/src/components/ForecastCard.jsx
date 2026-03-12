import Card from "./Card";

export default function ForecastCard({ forecastQ }) {
    return (
        <Card title="5-day forecast">
            {forecastQ.isLoading ? (
                <div className="muted">Loading…</div>
            ) : forecastQ.isError ? (
                <div className="error">
                    Error: {String(forecastQ.error?.message || forecastQ.error)}
                </div>
            ) : forecastQ.data?.days?.length ? (
                <div className="forecastTable">
                    <div className="ftHead">
                        <div>Date</div>
                        <div>Min</div>
                        <div>Max</div>
                        <div>Wind</div>
                        <div>Description</div>
                    </div>

                    {forecastQ.data.days.map((d) => (
                        <div className="ftRow" key={d.date}>
                            <div className="ftDate">{d.date}</div>
                            <div>{Math.round(d.min_c)}°</div>
                            <div>{Math.round(d.max_c)}°</div>
                            <div className="muted">
                                {d.wind_kph != null ? `${Math.round(d.wind_kph)} km/h` : "-"}
                            </div>
                            <div className="muted">{d.condition}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="muted">No forecast data</div>
            )}
        </Card>
    );
}