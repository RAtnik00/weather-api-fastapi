import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
const SYSTEM_LIGHT_THEME_QUERY = "(prefers-color-scheme: light)";

function normalizeThemePreference(value) {
    if (value === "soft") {
        return "light";
    }

    if (value === "system" || value === "dark" || value === "light") {
        return value;
    }

    return "system";
}

function applyTheme(nextTheme) {
    document.documentElement.dataset.theme = nextTheme;
}

function getSystemTheme() {
    if (typeof window === "undefined" || !window.matchMedia) {
        return "dark";
    }

    return window.matchMedia(SYSTEM_LIGHT_THEME_QUERY).matches ? "light" : "dark";
}

function resolveTheme(themePreference, systemTheme) {
    return themePreference === "system" ? systemTheme : themePreference;
}

function getInitialThemePreference() {
    return normalizeThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
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
    const [themePreference, setThemePreference] = useState(getInitialThemePreference);
    const [systemTheme, setSystemTheme] = useState(getSystemTheme);
    const [input, setInput] = useState(DEFAULT_CITY);
    const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
    const theme = resolveTheme(themePreference, systemTheme);

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

    useLayoutEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    }, [themePreference]);

    useEffect(() => {
        const mediaQuery = window.matchMedia(SYSTEM_LIGHT_THEME_QUERY);

        function handleSystemThemeChange(event) {
            setSystemTheme(event.matches ? "light" : "dark");
        }

        mediaQuery.addEventListener("change", handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
    }, []);

    useEffect(() => {
        const resolvedCity = currentQ.data?.city;
        if (!resolvedCity) return;
        if (lastHistorySyncCityRef.current === resolvedCity) return;

        lastHistorySyncCityRef.current = resolvedCity;
        historyQ.refetch();
    }, [currentQ.data?.city, historyQ]);

    function handleThemePreferenceChange(nextPreference) {
        setThemePreference(nextPreference);
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
                        <div
                            className="themeToggle"
                            data-active={themePreference}
                            aria-label="Theme"
                        >
                            {["system", "dark", "light"].map((option) => (
                                <button
                                    className={
                                        option === themePreference ? "active" : ""
                                    }
                                    key={option}
                                    type="button"
                                    aria-pressed={option === themePreference}
                                    onClick={() =>
                                        handleThemePreferenceChange(option)
                                    }
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

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
