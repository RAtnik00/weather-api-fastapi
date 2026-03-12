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

export function useCurrentWeather(city) {
    return useQuery({
        queryKey: ["weather", "current", city],
        queryFn: () => fetchCurrentWeather(city),
        enabled: Boolean(city),
    });
}

export function useCurrentWeatherByCoords(lat, lon) {
    return useQuery({
        queryKey: ["weather", "current", "coords", lat, lon],
        queryFn: () => fetchCurrentWeatherByCoords(lat, lon),
        enabled: Number.isFinite(lat) && Number.isFinite(lon),
    });
}

export function useForecast(city) {
    return useQuery({
        queryKey: ["weather", "forecast", city],
        queryFn: () => fetchForecast(city),
        enabled: Boolean(city),
    });
}

export function useForecastByCoords(lat, lon) {
    return useQuery({
        queryKey: ["weather", "forecast", "coords", lat, lon],
        queryFn: () => fetchForecastByCoords(lat, lon),
        enabled: Number.isFinite(lat) && Number.isFinite(lon),
    });
}

export function useHistory() {
    return useQuery({
        queryKey: ["weather", "history"],
        queryFn: fetchHistory,
    });
}

export function useFavorites() {
    return useQuery({
        queryKey: ["weather", "favorites"],
        queryFn: fetchFavorites,
    });
}

export function useAddFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weather", "favorites"] });
        },
    });
}

export function useRemoveFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeFavorite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weather", "favorites"] });
        },
    });
}