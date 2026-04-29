import { useEffect, useRef, useState } from "react";
import {
    useAddFavorite,
    useFavorites,
    useHistory,
    useRemoveFavorite,
} from "./services/useWeather";
import { useGeoWeather } from "./hooks/useGeoWeather";
import SearchBar from "./components/SearchBar";
import CurrentWeatherCard from "./features/weather/components/CurrentWeatherCard";
import ForecastCard from "./features/weather/components/ForecastCard";
import HistoryCard from "./features/weather/components/HistoryCard";
import FavoritesCard from "./features/weather/components/FavoritesCard";
import QuickActionsCard from "./features/weather/components/QuickActionsCard";
import { DEFAULT_CITY } from "./constants/weather";
import "./App.css";

const THEME_STORAGE_KEY = "weather_theme";

function normalizeTheme(value) {
    return value === "soft" || value === "light" ? "light" : "dark";
}

function applyTheme(nextTheme) {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

function getInitialTheme() {
    const initialTheme = normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
    applyTheme(initialTheme);
    return initialTheme;
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
    const [theme, setTheme] = useState(getInitialTheme);
    const [input, setInput] = useState(DEFAULT_CITY);
    const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);

    const {
        currentQ,
        forecastQ,
        mustAnswerConsent,
        activeCity,
        selectCityMode,
        handleAcceptGeoCache,
        handleDeclineGeoCache,
    } = useGeoWeather(selectedCity);

    const historyQ = useHistory();
    const favoritesQ = useFavorites();

    const addFavoriteM = useAddFavorite();
    const removeFavoriteM = useRemoveFavorite();

    const lastHistorySyncCityRef = useRef(null);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        const resolvedCity = currentQ.data?.city;
        if (!resolvedCity) return;
        if (lastHistorySyncCityRef.current === resolvedCity) return;

        lastHistorySyncCityRef.current = resolvedCity;
        historyQ.refetch();
    }, [currentQ.data?.city, historyQ]);

    function handleToggleTheme() {
        setTheme((currentTheme) => {
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            return nextTheme;
        });
    }

    function handleSearch(nextCityOverride) {
        const nextCity = (nextCityOverride ?? input).trim();
        if (!nextCity) return;

        selectCityMode();
        setSelectedCity(nextCity);
    }

    function handleSelectCity(nextCity) {
        setInput(nextCity);
        selectCityMode();
        setSelectedCity(nextCity);
    }

    function handleAddFavorite(targetCity) {
        const nextCity = targetCity?.trim();
        if (!nextCity) return;

        addFavoriteM.mutate(nextCity);
    }

    function handleRemoveFavorite(targetCity) {
        removeFavoriteM.mutate(targetCity);
    }

    function handleRefresh() {
        currentQ.refetch();
        forecastQ.refetch();
        historyQ.refetch();
        favoritesQ.refetch();
    }

    function handleAcceptConsent() {
        handleAcceptGeoCache();
        historyQ.refetch();
        favoritesQ.refetch();
    }

    function handleDeclineConsent() {
        handleDeclineGeoCache();
        historyQ.refetch();
        favoritesQ.refetch();
    }

    return (
        <div className="page">
            {mustAnswerConsent &&
                renderConsentModal({
                    onAccept: handleAcceptConsent,
                    onDecline: handleDeclineConsent,
                })}

            <div className="shell">
                <header className="topbar">
                    <div>
                        <div className="h1">Weather</div>
                        <div className="sub">Desktop dashboard</div>
                    </div>

                    <div className="topbarActions">
                        <button
                            className="themeToggle"
                            type="button"
                            onClick={handleToggleTheme}
                        >
                            {theme === "dark" ? "Light" : "Dark"}
                        </button>

                        <SearchBar
                            input={input}
                            setInput={setInput}
                            onSearch={handleSearch}
                        />
                    </div>
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
