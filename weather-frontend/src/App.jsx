import { useEffect, useMemo, useRef, useState } from "react";
import {
    useAddFavorite,
    useCurrentWeather,
    useCurrentWeatherByCoords,
    useFavorites,
    useForecast,
    useForecastByCoords,
    useHistory,
    useRemoveFavorite,
} from "./services/useWeather";
import SearchBar from "./components/SearchBar";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import ForecastCard from "./components/ForecastCard";
import HistoryCard from "./components/HistoryCard";
import FavoritesCard from "./components/FavoritesCard";
import QuickActionsCard from "./components/QuickActionsCard";
import "./App.css";

export default function App() {
    const [input, setInput] = useState("");
    const [city, setCity] = useState("");
    const [coords, setCoords] = useState(() => {
        const raw = localStorage.getItem("weather_coords");
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw);
            if (
                typeof parsed?.lat === "number" &&
                typeof parsed?.lon === "number"
            ) {
                return parsed;
            }
        } catch {
            return null;
        }

        return null;
    });

    const [useGeoWeather, setUseGeoWeather] = useState(() => {
        const raw = localStorage.getItem("weather_coords");
        return Boolean(raw);
    });

    const [geoResolved, setGeoResolved] = useState(() => {
        const raw = localStorage.getItem("weather_coords");
        return Boolean(raw);
    });

    const didTryGeolocationRef = useRef(false);
    const lastHistorySyncCityRef = useRef(null);

    const currentByCityQ = useCurrentWeather(city);
    const forecastByCityQ = useForecast(city);

    const currentByCoordsQ = useCurrentWeatherByCoords(
        coords?.lat,
        coords?.lon
    );
    const forecastByCoordsQ = useForecastByCoords(
        coords?.lat,
        coords?.lon
    );

    const historyQ = useHistory();
    const favoritesQ = useFavorites();

    const addFavoriteM = useAddFavorite();
    const removeFavoriteM = useRemoveFavorite();

    useEffect(() => {
        if (didTryGeolocationRef.current) return;
        didTryGeolocationRef.current = true;

        if (!("geolocation" in navigator)) {
            if (!coords) {
                setCity("Warsaw");
                setUseGeoWeather(false);
            }
            setGeoResolved(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const nextCoords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };

                localStorage.setItem("weather_coords", JSON.stringify(nextCoords));
                setCoords(nextCoords);
                setUseGeoWeather(true);
                setGeoResolved(true);
            },
            (error) => {
                console.warn("Geolocation denied or unavailable:", error);

                if (!coords) {
                    setCity("Warsaw");
                    setUseGeoWeather(false);
                }

                setGeoResolved(true);
            },
            {
                enableHighAccuracy: false,
                timeout: 2500,
                maximumAge: 900000,
            }
        );
    }, [coords]);

    const currentQ = useMemo(() => {
        if (useGeoWeather && coords) {
            return currentByCoordsQ;
        }
        return currentByCityQ;
    }, [useGeoWeather, coords, currentByCoordsQ, currentByCityQ]);

    const forecastQ = useMemo(() => {
        if (useGeoWeather && coords) {
            return forecastByCoordsQ;
        }
        return forecastByCityQ;
    }, [useGeoWeather, coords, forecastByCoordsQ, forecastByCityQ]);

    useEffect(() => {
        if (!currentQ.data?.city) return;
        if (lastHistorySyncCityRef.current === currentQ.data.city) return;

        lastHistorySyncCityRef.current = currentQ.data.city;
        historyQ.refetch();
    }, [currentQ.data?.city, historyQ]);

    const handleSearch = () => {
        const nextCity = input.trim();
        if (!nextCity) return;

        setUseGeoWeather(false);
        setCity(nextCity);
    };

    const handleSelectCity = (nextCity) => {
        setInput(nextCity);
        setUseGeoWeather(false);
        setCity(nextCity);
    };

    const handleAddFavorite = (targetCity) => {
        const nextCity = targetCity?.trim();
        if (!nextCity) return;
        addFavoriteM.mutate(nextCity);
    };

    const handleRemoveFavorite = (targetCity) => {
        removeFavoriteM.mutate(targetCity);
    };

    const handleRefresh = () => {
        currentQ.refetch();
        forecastQ.refetch();
        historyQ.refetch();
        favoritesQ.refetch();
    };

    const activeCity = currentQ.data?.city || city;

    if (!geoResolved) {
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
                            <div className="card">
                                <div className="cardTitle">Current</div>
                                <div className="muted">Detecting your location...</div>
                            </div>
                        </section>

                        <section className="rightCol">
                            <div className="card">
                                <div className="cardTitle">Forecast</div>
                                <div className="muted">Waiting for weather data...</div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        );
    }

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

                        <QuickActionsCard
                            city={activeCity}
                            onAddFavorite={handleAddFavorite}
                            onRefresh={handleRefresh}
                            isAddingFavorite={addFavoriteM.isPending}
                        />
                    </section>

                    <section className="rightCol">
                        <ForecastCard forecastQ={forecastQ} />

                        <div className="rightBottom">
                            <HistoryCard
                                historyQ={historyQ}
                                onSelectCity={handleSelectCity}
                            />

                            <FavoritesCard
                                favoritesQ={favoritesQ}
                                onSelectCity={handleSelectCity}
                                onRemoveFavorite={handleRemoveFavorite}
                                removingCity={removeFavoriteM.variables}
                            />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}