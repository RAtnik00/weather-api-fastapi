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

    return Boolean(localStorage.getItem(STORAGE_KEYS.coords));
}

export function useGeoWeather(selectedCity) {
    const [geoCacheConsent, setGeoCacheConsent] = useState(getStoredConsent);
    const [pendingCoords, setPendingCoords] = useState(null);
    const [coords, setCoords] = useState(getStoredCoords);
    const [useGeoWeatherMode, setUseGeoWeatherMode] = useState(
        shouldUseStoredGeolocation
    );
    const [geoResolved, setGeoResolved] = useState(shouldUseStoredGeolocation);

    const didTryGeolocationRef = useRef(false);

    const currentByCityQ = useCurrentWeather(selectedCity);
    const forecastByCityQ = useForecast(selectedCity);

    const currentByCoordsQ = useCurrentWeatherByCoords(coords?.lat, coords?.lon);
    const forecastByCoordsQ = useForecastByCoords(coords?.lat, coords?.lon);

    useEffect(() => {
        if (didTryGeolocationRef.current) return;
        didTryGeolocationRef.current = true;

        if (!("geolocation" in navigator)) {
            if (!coords) {
                setUseGeoWeatherMode(false);
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
                    localStorage.setItem(
                        STORAGE_KEYS.coords,
                        JSON.stringify(nextCoords)
                    );
                }

                setCoords(nextCoords);
                setUseGeoWeatherMode(true);
                setGeoResolved(true);
            },
            (error) => {
                console.warn("Geolocation denied or unavailable:", error);

                if (!coords) {
                    setUseGeoWeatherMode(false);
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
        }
    }

    function handleDeclineGeoCache() {
        setGeoCacheConsent("declined");
        localStorage.setItem(STORAGE_KEYS.cookieConsent, "declined");
        localStorage.removeItem(STORAGE_KEYS.coords);
        setCoords(null);
        setPendingCoords(null);
        setUseGeoWeatherMode(false);
    }

    const mustAnswerConsent =
        geoResolved && pendingCoords && geoCacheConsent === DEFAULT_COOKIE_CONSENT;

    const activeCity = currentQ.data?.city || selectedCity || DEFAULT_CITY;

    return {
        currentQ,
        forecastQ,
        geoResolved,
        mustAnswerConsent,
        activeCity,
        selectCityMode,
        handleAcceptGeoCache,
        handleDeclineGeoCache,
    };
}