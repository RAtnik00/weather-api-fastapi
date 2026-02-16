from typing import Protocol

from app.clients.weather_client import WeatherClient

class WeatherService(Protocol):
    def __init__(self, client: WeatherClient):
        self.client = client

    def get_current_weather(self, location):
        return self.client.get_current_weather(location)

    def get_forecast(self, location):
        return self.client.get_forecast(location)

    def get_yesterday_weather(self, location):
        return self.client.get_yesterday_weather(location)
