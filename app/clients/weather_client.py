from typing import Protocol
from app.models.weather import CurrentWeatherData, ForecastData


class WeatherClient(Protocol):
    def get_current_weather(self, location: str) -> CurrentWeatherData:
        pass

    def get_forecast(self, location: str) -> ForecastData:
        pass
