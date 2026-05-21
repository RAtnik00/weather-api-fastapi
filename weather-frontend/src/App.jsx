import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    useAddFavorite,
    useAddHistory,
    useClearHistory,
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
const THEME_OPTIONS = ["system", "dark", "light"];
const THEME_LABELS = {
    system: "System theme",
    dark: "Dark theme",
    light: "Light theme",
};
const THEME_ICONS = {
    system: (
        <svg className="themeSvg" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="themeSystemLight" cx="12" cy="12" r="8.5" />
            <path className="themeSystemDark" d="M12 3.5a8.5 8.5 0 0 1 0 17Z" />
            <path className="themeSystemLine" d="M12 3.5v17" />
            <circle className="themeSystemSun" cx="8.2" cy="9" r="1.8" />
            <path className="themeSystemMoon" d="M16.7 8.2a4.3 4.3 0 0 0 0 7.6 4.4 4.4 0 1 1 0-7.6Z" />
        </svg>
    ),
    dark: (
        <svg className="themeSvg" viewBox="0 0 24 24" aria-hidden="true">
            <path
                className="themeMoon"
                d="M18.4 15.5A7.5 7.5 0 0 1 8.5 5.6a7.6 7.6 0 1 0 9.9 9.9Z"
            />
            <path className="themeStarLarge" d="M17.4 4.4l.55 1.45 1.45.55-1.45.55-.55 1.45-.55-1.45-1.45-.55 1.45-.55.55-1.45Z" />
            <path className="themeStarSmall" d="M20.2 9.4l.35.85.85.35-.85.35-.35.85-.35-.85-.85-.35.85-.35.35-.85Z" />
        </svg>
    ),
    light: (
        <svg className="themeSvg" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="themeSunCore" cx="12" cy="12" r="4.2" />
            <path
                className="themeSunRays"
                d="M12 2.8v2.4M12 18.8v2.4M4.2 12H1.8M22.2 12h-2.4M6.45 6.45 4.75 4.75M19.25 19.25l-1.7-1.7M17.55 6.45l1.7-1.7M4.75 19.25l1.7-1.7"
            />
        </svg>
    ),
};

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

function getNextThemePreference(themePreference) {
    const currentIndex = THEME_OPTIONS.indexOf(themePreference);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % THEME_OPTIONS.length;

    return THEME_OPTIONS[nextIndex];
}

function getInitialThemePreference() {
    return normalizeThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
}

function isSameCity(firstCity, secondCity) {
    return firstCity?.trim().toLowerCase() === secondCity?.trim().toLowerCase();
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
    const isRefreshing =
        currentQ.isFetching ||
        forecastQ.isFetching ||
        historyQ.isFetching ||
        favoritesQ.isFetching;

    const addFavoriteM = useAddFavorite();
    const removeFavoriteM = useRemoveFavorite();
    const addHistoryM = useAddHistory();
    const clearHistoryM = useClearHistory();

    const pendingHistoryCityRef = useRef(null);

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
        const pendingCity = pendingHistoryCityRef.current;

        if (currentQ.isError) {
            pendingHistoryCityRef.current = null;
            return;
        }

        if (!resolvedCity) return;
        if (!pendingCity) return;

        pendingHistoryCityRef.current = null;
        addHistoryM.mutate(resolvedCity);
    }, [addHistoryM, currentQ.data?.city, currentQ.isError]);

    function handleThemePreferenceToggle() {
        setThemePreference((currentPreference) =>
            getNextThemePreference(currentPreference),
        );
    }

    function handleSearch(nextCityOverride) {
        const nextCity = (nextCityOverride ?? input).trim();
        if (!nextCity) return;

        if (isSameCity(currentQ.data?.city, nextCity)) {
            addHistoryM.mutate(currentQ.data.city);
            pendingHistoryCityRef.current = null;
        } else {
            pendingHistoryCityRef.current = nextCity;
        }

        selectCityMode();
        setSelectedCity(nextCity);
    }

    function handleSelectCity(nextCity) {
        if (isSameCity(currentQ.data?.city, nextCity)) {
            addHistoryM.mutate(currentQ.data.city);
            pendingHistoryCityRef.current = null;
        } else {
            pendingHistoryCityRef.current = nextCity;
        }

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

    function handleClearHistory() {
        pendingHistoryCityRef.current = null;
        clearHistoryM.mutate();
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
                            data-active={themePreference}
                            aria-label={`${THEME_LABELS[themePreference]}. Switch theme mode`}
                            title={THEME_LABELS[themePreference]}
                            onClick={handleThemePreferenceToggle}
                        >
                            <span className="themeIcon" aria-hidden="true">
                                {THEME_ICONS[themePreference]}
                            </span>
                            <span className="srOnly">
                                {THEME_LABELS[themePreference]}
                            </span>
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
                            isRefreshing={isRefreshing}
                        />
                    </section>

                    <section className="rightCol">
                        <ForecastCard forecastQ={forecastQ} />

                        <div className="rightBottom">
                            <HistoryCard
                                historyQ={historyQ}
                                onSelectCity={handleSelectCity}
                                onClearHistory={handleClearHistory}
                                isClearingHistory={clearHistoryM.isPending}
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
