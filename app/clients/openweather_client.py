from datetime import datetime

import httpx

from app.exceptions.weather import (
    CityNotFoundError,
    WeatherAuthError,
    WeatherRateLimitError,
    WeatherUpstreamError,
)
from app.models.weather import CurrentWeatherData, ForecastData, ForecastItemData


class OpenWeatherClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key

    def get_current_weather(self, location: str) -> CurrentWeatherData:
        url = f"{self.base_url}/weather"
        params = {"q": location, "appid": self.api_key, "units": "metric"}
        raw = self._get(url, params)

        main = raw.get("main") or {}
        weather_arr = raw.get("weather") or []
        wind = raw.get("wind") or {}

        description = ""
        if weather_arr and isinstance(weather_arr, list):
            first_weather = weather_arr[0] or {}
            description = str(first_weather.get("description") or "").strip()

        humidity = main.get("humidity")
        if not isinstance(humidity, int):
            humidity = None

        return CurrentWeatherData(
            city=str(raw.get("name") or location),
            temp_c=float(main.get("temp") or 0.0),
            feels_like_c=float(main.get("feels_like") or 0.0),
            description=description,
            wind_speed=float(wind.get("speed") or 0.0),
            humidity=humidity,
        )

    def get_forecast(self, location: str) -> ForecastData:
        url = f"{self.base_url}/forecast"
        params = {"q": location, "appid": self.api_key, "units": "metric"}
        raw = self._get(url, params)

        city = (raw.get("city") or {}).get("name") or location
        raw_items = raw.get("list") or []

        items: list[ForecastItemData] = []

        for item in raw_items:
            dt_txt = item.get("dt_txt")
            if not dt_txt:
                continue

            forecast_date = datetime.strptime(dt_txt, "%Y-%m-%d %H:%M:%S").date()

            main = item.get("main") or {}
            wind = item.get("wind") or {}
            weather_arr = item.get("weather") or []

            temp = main.get("temp")
            temp_value = float(temp) if isinstance(temp, (int, float)) else None

            wind_speed = wind.get("speed")
            wind_value = float(wind_speed) if isinstance(wind_speed, (int, float)) else None

            description: str | None = None
            if weather_arr and isinstance(weather_arr, list):
                first_weather = weather_arr[0] or {}
                raw_description = first_weather.get("description")
                if isinstance(raw_description, str) and raw_description.strip():
                    description = raw_description.strip()

            items.append(
                ForecastItemData(
                    forecast_date=forecast_date,
                    temp_c=temp_value,
                    wind_speed=wind_value,
                    description=description,
                )
            )

        return ForecastData(city=str(city), items=items)

    def _get(self, url: str, params: dict) -> dict:
        try:
            response = httpx.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()

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