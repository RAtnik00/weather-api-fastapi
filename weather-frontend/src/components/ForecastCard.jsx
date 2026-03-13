import Card from "./Card";

function formatForecastDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    if (isToday) return "Today";

    return date.toLocaleDateString("en-US", { weekday: "long" });
}

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
                            <div className="ftDate">{formatForecastDate(d.date)}</div>
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
