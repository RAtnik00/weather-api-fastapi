from collections import Counter, defaultdict
from statistics import mean

from app.cache.weather_cache import WeatherCache
from app.clients.weather_client import WeatherClient
from app.schemas.weather import CurrentWeatherResponse, ForecastDay, ForecastResponse


class WeatherService:
    def __init__(self, client: WeatherClient, cache: WeatherCache) -> None:
        self.client = client
        self.cache = cache

    def get_current_weather(self, location: str) -> CurrentWeatherResponse:
        key = self.cache.make_key(location)
        cached = self.cache.get_current(key)
        if cached is not None:
            return cached

        current = self.client.get_current_weather(location)

        result = CurrentWeatherResponse(
            city=current.city,
            temp_c=current.temp_c,
            feels_like_c=current.feels_like_c,
            description=current.description,
            wind_speed=current.wind_speed,
            humidity=current.humidity,
        )

        self.cache.set_current(key, result)
        return result

    def get_forecast(self, location: str) -> ForecastResponse:
        key = self.cache.make_key(location)
        cached = self.cache.get_forecast(key)
        if cached is not None:
            return cached

        forecast = self.client.get_forecast(location)

        by_day_temps: dict = defaultdict(list)
        by_day_winds: dict = defaultdict(list)
        by_day_desc: dict = defaultdict(list)

        for item in forecast.items:
            if item.temp_c is not None:
                by_day_temps[item.forecast_date].append(item.temp_c)

            if item.wind_speed is not None:
                by_day_winds[item.forecast_date].append(item.wind_speed)

            if item.description:
                by_day_desc[item.forecast_date].append(item.description)

        days_sorted = sorted(
            by_day_temps.keys() | by_day_winds.keys() | by_day_desc.keys()
        )[:5]

        result_days: list[ForecastDay] = []
        for day in days_sorted:
            temps = by_day_temps.get(day, [])
            winds = by_day_winds.get(day, [])
            descriptions = by_day_desc.get(day, [])

            result_days.append(
                ForecastDay(
                    date=day,
                    temp_min_c=round(min(temps), 1) if temps else None,
                    temp_max_c=round(max(temps), 1) if temps else None,
                    wind_speed_avg=round(mean(winds), 1) if winds else None,
                    description=Counter(descriptions).most_common(1)[0][0] if descriptions else None,
                )
            )

        result = ForecastResponse(city=forecast.city, days=result_days)
        self.cache.set_forecast(key, result)
        return result