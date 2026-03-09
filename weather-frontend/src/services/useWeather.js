import { useQuery } from "@tanstack/react-query";
import { fetchCurrent, fetchForecast } from "./weatherApi.js";

export function useCurrentWeather(city) {
    return useQuery({
        queryKey: ["weather", "current", city],
        queryFn: () => fetchCurrent(city),
        enabled: !!city,
    });
}

export function useForecast(city) {
    return useQuery({
        queryKey: ["weather", "forecast", city],
        queryFn: () => fetchForecast(city),
        enabled: !!city,
    });
}