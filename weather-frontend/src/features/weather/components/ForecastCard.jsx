import Card from "../../../components/Card.jsx";
import {
    formatForecastDate,
    formatTemperature,
    formatWind,
} from "../../../utils/weatherFormatters.js";

export default function ForecastCard({ forecastQ }) {
    const forecast = forecastQ.data;
    const days = forecast?.days ?? [];

    if (forecastQ.isLoading) {
        return (
            <Card title="5-day forecast">
                <div className="muted">Loading…</div>
            </Card>
        );
    }

    if (forecastQ.isError) {
        return (
            <Card title="5-day forecast">
                <div className="error">
                    Error: {String(forecastQ.error?.message || forecastQ.error)}
                </div>
            </Card>
        );
    }

    if (!days.length) {
        return (
            <Card title="5-day forecast">
                <div className="muted">No forecast data</div>
            </Card>
        );
    }

    return (
        <Card title="5-day forecast">
            <div className="forecastTable">
                <div className="ftHead">
                    <div>Date</div>
                    <div>Min</div>
                    <div>Max</div>
                    <div>Wind</div>
                    <div>Description</div>
                </div>

                {days.map((day) => (
                    <div className="ftRow" key={day.date}>
                        <div className="ftDate">{formatForecastDate(day.date)}</div>
                        <div>{formatTemperature(day.min_c)}</div>
                        <div>{formatTemperature(day.max_c)}</div>
                        <div className="muted">{formatWind(day.wind_kph)}</div>
                        <div className="muted">{day.condition}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}