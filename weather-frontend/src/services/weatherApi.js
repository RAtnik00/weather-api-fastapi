import api from "./apiClient";

export async function fetchCurrent(city) {
    const res = await api.get("/weather/current", { params: { location: city } });

    console.log("RAW current res:", res);
    console.log("RAW current res.data:", res.data);

    const d = res.data;

    return {
        city: d.city,
        temp_c: d.temp_c,
        feelslike_c: d.feels_like_c,
        condition: d.description,
        wind_kph: d.wind_speed,
        humidity: d.humidity ?? null,
    };
}

export async function fetchForecast(city) {
    const res = await api.get("/weather/forecast", { params: { location: city } });

    console.log("RAW forecast res:", res);
    console.log("RAW forecast res.data:", res.data);

    const d = res.data;

    return {
        city: d.city,
        days: (d.days || []).map((day) => ({
            date: day.date,
            min_c: day.temp_min_c,
            max_c: day.temp_max_c,
            condition: day.description,
        })),
    };
}