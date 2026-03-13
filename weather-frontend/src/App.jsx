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

const DEFAULT_CITY = "Warsaw";
const CONSENT_STORAGE_KEY = "weather_geo_cache_consent";
const COORDS_STORAGE_KEY = "weather_coords";

function getStoredConsent() {
    return localStorage.getItem(CONSENT_STORAGE_KEY) || "unset";
}

function getStoredCoords() {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (consent !== "accepted") return null;

    const raw = localStorage.getItem(COORDS_STORAGE_KEY);
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
}

function shouldUseStoredGeolocation() {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (consent !== "accepted") return false;

    return Boolean(localStorage.getItem(COORDS_STORAGE_KEY));
}

function renderInitialLayout({ input, setInput, onSearch, leftText, rightText }) {
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
                        onSearch={onSearch}
                    />
                </header>

                <main className="grid">
                    <section className="colLeft">
                        <div className="card">
                            <div className="cardTitle">Current</div>
                            <div className="muted">{leftText}</div>
                        </div>
                    </section>

                    <section className="rightCol">
                        <div className="card">
                            <div className="cardTitle">Forecast</div>
                            <div className="muted">{rightText}</div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

function renderConsentModal({ onAccept, onDecline }) {
    return (
        <div className="consentOverlay">
            <div className="consentModal">
                <div className="consentTitle">Save location data?</div>
                <div className="consentText">
                    We can save your location on this device to load weather faster next time.
                    You need to choose whether to allow this before using the site.
                </div>
                <div className="consentActions">
                    <button type="button" onClick={onAccept}>
                        Yes, allow
                    </button>
                    <button type="button" onClick={onDecline}>
                        No, do not allow
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [input, setInput] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [geoCacheConsent, setGeoCacheConsent] = useState(getStoredConsent);
    const [pendingCoords, setPendingCoords] = useState(null);
    const [coords, setCoords] = useState(getStoredCoords);
    const [useGeoWeather, setUseGeoWeather] = useState(shouldUseStoredGeolocation);
    const [geoResolved, setGeoResolved] = useState(shouldUseStoredGeolocation);

    const didTryGeolocationRef = useRef(false);
    const lastHistorySyncCityRef = useRef(null);

    const currentByCityQ = useCurrentWeather(selectedCity);
    const forecastByCityQ = useForecast(selectedCity);

    const currentByCoordsQ = useCurrentWeatherByCoords(coords?.lat, coords?.lon);
    const forecastByCoordsQ = useForecastByCoords(coords?.lat, coords?.lon);

    const historyQ = useHistory();
    const favoritesQ = useFavorites();

    const addFavoriteM = useAddFavorite();
    const removeFavoriteM = useRemoveFavorite();

    useEffect(() => {
        if (didTryGeolocationRef.current) return;
        didTryGeolocationRef.current = true;

        if (!("geolocation" in navigator)) {
            if (!coords) {
                setSelectedCity(DEFAULT_CITY);
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

                setPendingCoords(nextCoords);

                if (geoCacheConsent === "accepted") {
                    localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(nextCoords));
                }

                setCoords(nextCoords);
                setUseGeoWeather(true);
                setGeoResolved(true);
            },
            (error) => {
                console.warn("Geolocation denied or unavailable:", error);

                if (!coords) {
                    setSelectedCity(DEFAULT_CITY);
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
    }, [coords, geoCacheConsent]);

    const currentQ = useMemo(() => {
        return useGeoWeather && coords ? currentByCoordsQ : currentByCityQ;
    }, [useGeoWeather, coords, currentByCoordsQ, currentByCityQ]);

    const forecastQ = useMemo(() => {
        return useGeoWeather && coords ? forecastByCoordsQ : forecastByCityQ;
    }, [useGeoWeather, coords, forecastByCoordsQ, forecastByCityQ]);

    useEffect(() => {
        const activeWeatherCity = currentQ.data?.city;
        if (!activeWeatherCity) return;
        if (lastHistorySyncCityRef.current === activeWeatherCity) return;

        lastHistorySyncCityRef.current = activeWeatherCity;
        historyQ.refetch();
    }, [currentQ.data?.city, historyQ]);

    const handleSearch = () => {
        const nextCity = input.trim();
        if (!nextCity) return;

        setUseGeoWeather(false);
        setSelectedCity(nextCity);
    };

    const handleSelectCity = (nextCity) => {
        setInput(nextCity);
        setUseGeoWeather(false);
        setSelectedCity(nextCity);
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

    const handleAcceptGeoCache = () => {
        setGeoCacheConsent("accepted");
        localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");

        if (pendingCoords) {
            localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(pendingCoords));
            setCoords(pendingCoords);
        }

        historyQ.refetch();
        favoritesQ.refetch();
    };

    const handleDeclineGeoCache = () => {
        setGeoCacheConsent("declined");
        localStorage.setItem(CONSENT_STORAGE_KEY, "declined");
        localStorage.removeItem(COORDS_STORAGE_KEY);
        setCoords(null);
        setPendingCoords(null);
        setUseGeoWeather(false);

        historyQ.refetch();
        favoritesQ.refetch();
    };

    const activeCity = currentQ.data?.city || selectedCity;
    const mustAnswerConsent =
        geoResolved && pendingCoords && geoCacheConsent === "unset";

    if (!geoResolved) {
        return renderInitialLayout({
            input,
            setInput,
            onSearch: handleSearch,
            leftText: "Detecting your location...",
            rightText: "Waiting for weather data...",
        });
    }

    return (
        <div className="page">
            {mustAnswerConsent &&
                renderConsentModal({
                    onAccept: handleAcceptGeoCache,
                    onDecline: handleDeclineGeoCache,
                })}

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
