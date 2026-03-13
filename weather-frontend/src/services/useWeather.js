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

const weatherQueryKeys = {
    currentByCity: (city) => ["weather", "current", city],
    currentByCoords: (lat, lon) => ["weather", "current", "coords", lat, lon],
    forecastByCity: (city) => ["weather", "forecast", city],
    forecastByCoords: (lat, lon) => ["weather", "forecast", "coords", lat, lon],
    history: () => ["weather", "history"],
    favorites: () => ["weather", "favorites"],
};

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
                queryKey: weatherQueryKeys.favorites(),
            });
        },
    });
}

export function useCurrentWeather(city) {
    return useQuery(
        createCityWeatherQuery({
            queryKey: weatherQueryKeys.currentByCity,
            queryFn: fetchCurrentWeather,
            city,
        })
    );
}

export function useCurrentWeatherByCoords(lat, lon) {
    return useQuery(
        createCoordsWeatherQuery({
            queryKey: weatherQueryKeys.currentByCoords,
            queryFn: fetchCurrentWeatherByCoords,
            lat,
            lon,
        })
    );
}

export function useForecast(city) {
    return useQuery(
        createCityWeatherQuery({
            queryKey: weatherQueryKeys.forecastByCity,
            queryFn: fetchForecast,
            city,
        })
    );
}

export function useForecastByCoords(lat, lon) {
    return useQuery(
        createCoordsWeatherQuery({
            queryKey: weatherQueryKeys.forecastByCoords,
            queryFn: fetchForecastByCoords,
            lat,
            lon,
        })
    );
}

export function useHistory() {
    return useQuery({
        queryKey: weatherQueryKeys.history(),
        queryFn: fetchHistory,
    });
}

export function useFavorites() {
    return useQuery({
        queryKey: weatherQueryKeys.favorites(),
        queryFn: fetchFavorites,
    });
}

export function useAddFavorite() {
    return useFavoritesMutation(addFavorite);
}

export function useRemoveFavorite() {
    return useFavoritesMutation(removeFavorite);
}
