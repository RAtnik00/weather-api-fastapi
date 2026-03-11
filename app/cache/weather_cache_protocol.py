from typing import Protocol

from app.schemas.weather import CurrentWeatherResponse, ForecastResponse

class WeatherCacheProtocol(Protocol):
    def make_key(self, location: str) -> str:
        pass

    def get_current(self, key: str) -> CurrentWeatherResponse | None:
        pass

    def set_current(self, key: str, value: CurrentWeatherResponse) -> None:
        pass

    def get_forecast(self, key: str) -> ForecastResponse | None:
        pass

    def set_forecast(self, key: str, value: ForecastResponse) -> None:
        pass