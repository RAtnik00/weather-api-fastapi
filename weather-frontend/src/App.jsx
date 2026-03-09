import { useState } from "react";
import { useCurrentWeather, useForecast } from "./services/useWeather";
import "./App.css";

function Card({ title, children }) {
    return (
        <div className="card">
            {title ? <div className="cardTitle">{title}</div> : null}
            {children}
        </div>
    );
}

export default function App() {
    const [input, setInput] = useState("Warsaw");
    const [city, setCity] = useState("Warsaw");

    const currentQ = useCurrentWeather(city);
    const forecastQ = useForecast(city);
    console.log("CITY:", city);
    console.log("CURRENT status:", {
        isLoading: currentQ.isLoading,
        isError: currentQ.isError,
        data: currentQ.data,
        error: currentQ.error,
    });
    console.log("FORECAST status:", {
        isLoading: forecastQ.isLoading,
        isError: forecastQ.isError,
        data: forecastQ.data,
        error: forecastQ.error,
    });

    return (
        <div className="page">
            <div className="shell">
                <header className="topbar">
                    <div>
                        <div className="h1">Weather</div>
                        <div className="sub">Desktop dashboard</div>
                    </div>

                    <form
                        className="search"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setCity(input.trim());
                        }}
                    >
                        <input
                            className="searchInput"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Search location (e.g., Warsaw)"
                        />
                        <button className="searchBtn" type="submit">
                            Search
                        </button>
                    </form>
                </header>

                <main className="grid">
                    <section className="colLeft">
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
                                                        ? `${Math.round(currentQ.data.wind_kph)}`
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

                        <Card title="Quick actions">
                            <div className="btnRow">
                                <button className="ghostBtn" type="button">
                                    ★ Add to favorites
                                </button>
                                <button className="ghostBtn" type="button">
                                    ⟳ Refresh
                                </button>
                            </div>
                            <div className="muted" style={{ marginTop: 10 }}>
                                (Let's connect favorites/history in the next step)
                            </div>
                        </Card>
                    </section>

                    <section className="rightCol">
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
                                            <div className="muted">—</div>
                                            <div className="muted">{d.condition}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="muted">No forecast data</div>
                            )}
                        </Card>

                        <div className="rightBottom">
                            <Card title="History">
                                <div className="muted">Here will be cookies from the cookie history.</div>
                            </Card>

                            <Card title="Favorites">
                                <div className="muted">
                                    Here will be a list of favorites + delete/select buttons.
                                </div>
                            </Card>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}