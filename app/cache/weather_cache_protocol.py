from typing import Protocol

from app.models.weather import CurrentWeatherData, ForecastData

class WeatherCacheProtocol(Protocol):
    def make_key(self, location: str) -> str:
        pass

    def get_current(self, key: str) -> CurrentWeatherData | None:
        pass

    def set_current(self, key: str, value: CurrentWeatherData) -> None:
        pass

    def get_forecast(self, key: str) -> ForecastData | None:
        pass

    def set_forecast(self, key: str, value: ForecastData) -> None:
        pass