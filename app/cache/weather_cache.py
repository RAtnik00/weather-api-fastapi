from cachetools import TTLCache

class WeatherCache:
    CURRENT_TTL_SECONDS = 60
    FORECAST_TTL_SECONDS = 600
    MAXSIZE = 256

    def __init__(self):
        self._current = TTLCache(maxsize=self.MAXSIZE, ttl=self.CURRENT_TTL_SECONDS)
        self._forecast = TTLCache(maxsize=self.MAXSIZE, ttl=self.FORECAST_TTL_SECONDS)

    def get_current(self, key: str):
        return self._current.get(key)

    def set_current(self, key: str, value) -> None:
        self._current[key] = value

    def get_forecast(self, key: str):
        return self._forecast.get(key)

    def set_forecast(self, key: str, value) -> None:
        self._forecast[key] = value

    def make_key(self, location: str) -> str:
        return self._key(location)

    @staticmethod
    def _key(location: str) -> str:
        return location.strip().lower()