import httpx

from app.exceptions.weather import CityNotFoundError, WeatherAuthError, WeatherRateLimitError, WeatherUpstreamError

class OpenWeatherClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key

    def get_current_weather(self, location: str) -> dict:
        url = f"{self.base_url}/weather"
        params = {"q": location, "appid": self.api_key, "units": "metric"}
        return self._get(url, params)

    def get_forecast(self, location: str) -> dict:
        url = f"{self.base_url}/forecast"
        params = {"q": location, "appid": self.api_key, "units": "metric"}
        return self._get(url, params)

    def _get(self, url: str, params: dict) -> dict:
        try:
            r = httpx.get(url, params=params, timeout=10)
            r.raise_for_status()
            return r.json()

        except httpx.HTTPStatusError as e:
            status = e.response.status_code

            if status == 404:
                raise CityNotFoundError("City not found") from e
            if status == 401:
                raise WeatherAuthError("Invalid OpenWeather API key") from e
            if status == 429:
                raise WeatherRateLimitError("OpenWeather rate limit exceeded") from e

            raise WeatherUpstreamError(f"OpenWeather API error: {status}") from e

        except httpx.RequestError as e:
            raise WeatherUpstreamError("OpenWeather is unreachable") from e