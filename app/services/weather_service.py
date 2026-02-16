from typing import Protocol

from app.clients.weather_client import WeatherClient
from app.schemas.weather import CurrentWeatherResponse

class WeatherService(Protocol):
    def __init__(self, client: WeatherClient):
        self.client = client

    def get_current_weather(self, location: str) -> CurrentWeatherResponse:
        raw = self.client.get_current_weather(location)
        return CurrentWeatherResponse(
            city=raw["name"],
            temp_c=raw["main"]["temp"],
            feels_like_c=raw["main"]["feels_like"],
            description=raw["weather"][0]["description"],
            wind_speed=raw["wind"]["speed"],
        )

    def get_forecast(self, location):
        return self.client.get_forecast(location)

    def get_yesterday_weather(self, location):
        return self.client.get_yesterday_weather(location)
