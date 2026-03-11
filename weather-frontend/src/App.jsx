import { useState } from "react";
import { useCurrentWeather, useForecast } from "./services/useWeather";
import Card from "./components/Card";
import SearchBar from "./components/SearchBar";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import ForecastCard from "./components/ForecastCard";
import "./App.css";

export default function App() {
    const [input, setInput] = useState("Warsaw");
    const [city, setCity] = useState("Warsaw");

    const currentQ = useCurrentWeather(city);
    const forecastQ = useForecast(city);

    const handleSearch = () => {
        const nextCity = input.trim();
        if (!nextCity) return;
        setCity(nextCity);
    };

    return (
        <div className="page">
            <div className="shell">
                <header className="topbar">
                    <div>
                        <div className="h1">Weather</div>
                        <div className="sub">Desktop dashboard</div>
                    </div>

                    <SearchBar
                        input={input}
                        setInput={setInput}
                        onSearch={handleSearch}
                    />
                </header>

                <main className="grid">
                    <section className="colLeft">
                        <CurrentWeatherCard currentQ={currentQ} />

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
                        <ForecastCard forecastQ={forecastQ} />

                        <div className="rightBottom">
                            <Card title="History">
                                <div className="muted">
                                    Here will be cookies from the cookie history.
                                </div>
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