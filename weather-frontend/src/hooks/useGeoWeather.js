import { useEffect, useMemo, useRef, useState } from "react";
import {
    useCurrentWeather,
    useCurrentWeatherByCoords,
    useForecast,
    useForecastByCoords,
} from "../services/useWeather";

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
                    localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(nextCoords));
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
        localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");

        if (pendingCoords) {
            localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(pendingCoords));
            setCoords(pendingCoords);
        }
    }

    function handleDeclineGeoCache() {
        setGeoCacheConsent("declined");
        localStorage.setItem(CONSENT_STORAGE_KEY, "declined");
        localStorage.removeItem(COORDS_STORAGE_KEY);
        setCoords(null);
        setPendingCoords(null);
        setUseGeoWeatherMode(false);
    }

    const mustAnswerConsent =
        geoResolved && pendingCoords && geoCacheConsent === "unset";

    const activeCity =
        currentQ.data?.city || selectedCity || DEFAULT_CITY;

    return {
        currentQ,
        forecastQ,
        geoResolved,
        mustAnswerConsent,
        activeCity,
        geoCacheConsent,
        coords,
        pendingCoords,
        useGeoWeatherMode,
        selectCityMode,
        handleAcceptGeoCache,
        handleDeclineGeoCache,
    };
}
