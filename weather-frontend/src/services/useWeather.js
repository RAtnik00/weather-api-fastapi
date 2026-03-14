import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    addFavorite,
    fetchCurrentWeather,
    fetchCurrentWeatherByCoords,
    fetchFavorites,
    fetchForecast,
    fetchForecastByCoords,
    fetchHistory,
    removeFavorite,
} from "./weatherApi";
import { WEATHER_QUERY_KEYS } from "../constants/weather";

function hasValidCoords(lat, lon) {
    return Number.isFinite(lat) && Number.isFinite(lon);
}

function createCityWeatherQuery({ queryKey, queryFn, city }) {
    return {
        queryKey: queryKey(city),
        queryFn: () => queryFn(city),
        enabled: Boolean(city),
    };
}

function createCoordsWeatherQuery({ queryKey, queryFn, lat, lon }) {
    return {
        queryKey: queryKey(lat, lon),
        queryFn: () => queryFn(lat, lon),
        enabled: hasValidCoords(lat, lon),
    };
}

function useFavoritesMutation(mutationFn) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: WEATHER_QUERY_KEYS.favorites(),
            });
        },
    });
}

export function useCurrentWeather(city) {
    return useQuery(
        createCityWeatherQuery({
            queryKey: WEATHER_QUERY_KEYS.currentByCity,
            queryFn: fetchCurrentWeather,
            city,
        })
    );
}

export function useCurrentWeatherByCoords(lat, lon) {
    return useQuery(
        createCoordsWeatherQuery({
            queryKey: WEATHER_QUERY_KEYS.currentByCoords,
            queryFn: fetchCurrentWeatherByCoords,
            lat,
            lon,
        })
    );
}

export function useForecast(city) {
    return useQuery(
        createCityWeatherQuery({
            queryKey: WEATHER_QUERY_KEYS.forecastByCity,
            queryFn: fetchForecast,
            city,
        })
    );
}

export function useForecastByCoords(lat, lon) {
    return useQuery(
        createCoordsWeatherQuery({
            queryKey: WEATHER_QUERY_KEYS.forecastByCoords,
            queryFn: fetchForecastByCoords,
            lat,
            lon,
        })
    );
}

export function useHistory() {
    return useQuery({
        queryKey: WEATHER_QUERY_KEYS.history(),
        queryFn: fetchHistory,
    });
}

export function useFavorites() {
    return useQuery({
        queryKey: WEATHER_QUERY_KEYS.favorites(),
        queryFn: fetchFavorites,
    });
}

export function useAddFavorite() {
    return useFavoritesMutation(addFavorite);
}

export function useRemoveFavorite() {
    return useFavoritesMutation(removeFavorite);
}