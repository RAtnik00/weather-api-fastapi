from typing import Protocol
from app.models.weather import CurrentWeatherData, ForecastData


class WeatherClient(Protocol):
    def get_current_weather(self, location: str) -> CurrentWeatherData:
        pass

    def get_forecast(self, location: str) -> ForecastData:
        pass

    def get_current_weather_by_coords(self, lat: float, lon: float) -> CurrentWeatherData:
        pass

    def get_forecast_by_coords(self, lat: float, lon: float) -> ForecastData:
        pass