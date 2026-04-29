import { useEffect, useMemo, useRef, useState } from "react";
import {
    useCurrentWeather,
    useCurrentWeatherByCoords,
    useForecast,
    useForecastByCoords,
} from "../services/useWeather";
import {
    DEFAULT_CITY,
    DEFAULT_COOKIE_CONSENT,
    STORAGE_KEYS,
} from "../constants/weather";

function getStoredConsent() {
    return localStorage.getItem(STORAGE_KEYS.cookieConsent) || DEFAULT_COOKIE_CONSENT;
}

function getStoredCoords() {
    const consent = localStorage.getItem(STORAGE_KEYS.cookieConsent);
    if (consent !== "accepted") return null;

    const raw = localStorage.getItem(STORAGE_KEYS.coords);
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
    const consent = localStorage.getItem(STORAGE_KEYS.cookieConsent);
    if (consent !== "accepted") return false;

    const raw = localStorage.getItem(STORAGE_KEYS.coords);
    if (!raw) return false;

    try {
        const parsed = JSON.parse(raw);
        return (
            typeof parsed?.lat === "number" &&
            typeof parsed?.lon === "number"
        );
    } catch {
        return false;
    }
}

function isGeolocationSupported() {
    return typeof navigator !== "undefined" && "geolocation" in navigator;
}

function getGeoErrorMessage(error) {
    if (!error) {
        return "Unknown geolocation error";
    }

    if (error.code === 1) {
        return "Geolocation permission denied";
    }

    if (error.code === 2) {
        return "Geolocation position unavailable";
    }

    if (error.code === 3) {
        return "Geolocation request timed out";
    }

    return error.message || "Unknown geolocation error";
}

export function useGeoWeather(selectedCity) {
    const [geoCacheConsent, setGeoCacheConsent] = useState(getStoredConsent);
    const [pendingCoords, setPendingCoords] = useState(null);
    const [coords, setCoords] = useState(getStoredCoords);
    const [useGeoWeatherMode, setUseGeoWeatherMode] = useState(
        shouldUseStoredGeolocation
    );

    const didTryGeolocationRef = useRef(false);

    const currentByCityQ = useCurrentWeather(selectedCity);
    const forecastByCityQ = useForecast(selectedCity);

    const currentByCoordsQ = useCurrentWeatherByCoords(coords?.lat, coords?.lon);
    const forecastByCoordsQ = useForecastByCoords(coords?.lat, coords?.lon);

    useEffect(() => {
        if (didTryGeolocationRef.current) return;
        didTryGeolocationRef.current = true;

        if (!isGeolocationSupported()) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const nextCoords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };

                setPendingCoords(nextCoords);
                setCoords(nextCoords);
                setUseGeoWeatherMode(true);

                if (geoCacheConsent === "accepted") {
                    localStorage.setItem(
                        STORAGE_KEYS.coords,
                        JSON.stringify(nextCoords)
                    );
                }
            },
            (error) => {
                const message = getGeoErrorMessage(error);

                if (error?.code === 1) {
                    console.info(message);
                } else {
                    console.warn(message);
                }

                setUseGeoWeatherMode(false);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000,
            }
        );
    }, [geoCacheConsent]);

    const currentQ = useMemo(() => {
        return useGeoWeatherMode && coords ? currentByCoordsQ : currentByCityQ;
    }, [useGeoWeatherMode, coords, currentByCoordsQ, currentByCityQ]);

    const forecastQ = useMemo(() => {
        return useGeoWeatherMode && coords ? forecastByCoordsQ : forecastByCityQ;
    }, [useGeoWeatherMode, coords, forecastByCoordsQ, forecastByCityQ]);

    function selectCityMode() {
        setUseGeoWeatherMode(false);
    }

    function handleAcceptGeoCache() {
        setGeoCacheConsent("accepted");
        localStorage.setItem(STORAGE_KEYS.cookieConsent, "accepted");

        if (pendingCoords) {
            localStorage.setItem(
                STORAGE_KEYS.coords,
                JSON.stringify(pendingCoords)
            );
            setCoords(pendingCoords);
            setUseGeoWeatherMode(true);
        }
    }

    function handleDeclineGeoCache() {
        setGeoCacheConsent("declined");
        localStorage.setItem(STORAGE_KEYS.cookieConsent, "declined");
        localStorage.removeItem(STORAGE_KEYS.coords);

        if (pendingCoords) {
            setCoords(pendingCoords);
            setUseGeoWeatherMode(true);
        }

        setPendingCoords(null);
    }

    const mustAnswerConsent =
        pendingCoords && geoCacheConsent === DEFAULT_COOKIE_CONSENT;

    const activeCity = currentQ.data?.city || selectedCity || DEFAULT_CITY;

    return {
        currentQ,
        forecastQ,
        mustAnswerConsent,
        activeCity,
        selectCityMode,
        handleAcceptGeoCache,
        handleDeclineGeoCache,
    };
}
