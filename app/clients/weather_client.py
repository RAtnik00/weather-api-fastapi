from typing import Protocol


class WeatherClient(Protocol):
    def get_current_weather(self, location: str) -> dict:
        pass
    def get_forecast(self, location: str) -> dict:
        pass
    def get_yesterday_weather(self, location: str) -> dict:
        pass
