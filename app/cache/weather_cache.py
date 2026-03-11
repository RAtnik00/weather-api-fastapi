from cachetools import TTLCache

from app.models.weather import CurrentWeatherData, ForecastData


class WeatherCache:
    def __init__(self) -> None:
        self._current_cache: TTLCache[str, CurrentWeatherData] = TTLCache(maxsize=128, ttl=600)
        self._forecast_cache: TTLCache[str, ForecastData] = TTLCache(maxsize=128, ttl=1800)

    def make_key(self, location: str) -> str:
        return location.strip().lower()

    def get_current(self, key: str) -> CurrentWeatherData | None:
        return self._current_cache.get(key)

    def set_current(self, key: str, value: CurrentWeatherData) -> None:
        self._current_cache[key] = value

    def get_forecast(self, key: str) -> ForecastData | None:
        return self._forecast_cache.get(key)

    def set_forecast(self, key: str, value: ForecastData) -> None:
        self._forecast_cache[key] = value