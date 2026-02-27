import time
import httpx

class OpenWeatherClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key

    def get_current_weather(self, location: str) -> dict:
        url = f"{self.base_url}/weather"
        params = {
            "q": location,
            "appid": self.api_key,
            "units": "metric",
        }
        response = httpx.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def get_forecast(self, location: str) -> dict:
        url = f"{self.base_url}/forecast"
        params = {
            "q": location,
            "appid": self.api_key,
            "units": "metric",
        }
        response = httpx.get(url, params=params)
        response.raise_for_status()
        return response.json()