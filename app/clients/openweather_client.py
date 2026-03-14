import logging
from datetime import datetime

import httpx

from app.exceptions.weather import (
    CityNotFoundError,
    WeatherAuthError,
    WeatherRateLimitError,
    WeatherUpstreamError,
)
from app.models.weather import (
    CitySuggestionData,
    CurrentWeatherData,
    ForecastData,
    ForecastItemData
)

logger = logging.getLogger(__name__)


class OpenWeatherClient:
    def __init__(self, base_url: str, api_key: str):
        self.api_key = api_key
        self.client = httpx.Client(
            base_url=base_url,
            timeout=10.0,
        )
        self.geo_base_url = "https://api.openweathermap.org/geo/1.0"

    def get_current_weather(self, location: str) -> CurrentWeatherData:
        logger.info("Fetching current weather for location='%s'", location)

        raw = self._get(
            "/weather",
            params={"q": location, "appid": self.api_key, "units": "metric"},
        )

        return self._map_current_weather(raw, fallback_city=location)

    def get_forecast(self, location: str) -> ForecastData:
        logger.info("Fetching forecast for location='%s'", location)

        raw = self._get(
            "/forecast",
            params={"q": location, "appid": self.api_key, "units": "metric"},
        )

        return self._map_forecast(raw, fallback_city=location)

    def get_current_weather_by_coords(self, lat: float, lon: float) -> CurrentWeatherData:
        logger.info("Fetching current weather for lat='%s', lon='%s'", lat, lon)

        raw = self._get(
            "/weather",
            params={"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"},
        )

        return self._map_current_weather(raw, fallback_city=f"{lat},{lon}")

    def get_forecast_by_coords(self, lat: float, lon: float) -> ForecastData:
        logger.info("Fetching forecast for lat='%s', lon='%s'", lat, lon)

        raw = self._get(
            "/forecast",
            params={"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"},
        )

        return self._map_forecast(raw, fallback_city=f"{lat},{lon}")

    def _map_current_weather(self, raw: dict, fallback_city: str) -> CurrentWeatherData:
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
            city=str(raw.get("name") or fallback_city),
            temp_c=float(main.get("temp") or 0.0),
            feels_like_c=float(main.get("feels_like") or 0.0),
            description=description,
            wind_speed=float(wind.get("speed") or 0.0),
            humidity=humidity,
        )

    def _map_forecast(self, raw: dict, fallback_city: str) -> ForecastData:
        city = (raw.get("city") or {}).get("name") or fallback_city
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

    def _get(self, path: str, params: dict) -> dict | list:
        try:
            response = self.client.get(path, params=params)
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            status = e.response.status_code
            logger.warning("OpenWeather HTTP error status=%s path='%s'", status, path)

            if status == 404:
                raise CityNotFoundError("City not found") from e
            if status == 401:
                raise WeatherAuthError("Invalid OpenWeather API key") from e
            if status == 429:
                raise WeatherRateLimitError("OpenWeather rate limit exceeded") from e

            raise WeatherUpstreamError(f"OpenWeather API error: {status}") from e

        except httpx.RequestError as e:
            logger.exception("OpenWeather request failed path='%s'", path)
            raise WeatherUpstreamError("OpenWeather is unreachable") from e

    def _get_geo(self, path: str, params: dict) -> dict | list:
        url = f"{self.geo_base_url}{path}"

        try:
            response = httpx.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            status = e.response.status_code
            logger.warning("OpenWeather GEO HTTP error status=%s path='%s'", status, path)

            if status == 404:
                raise CityNotFoundError("City not found") from e
            if status == 401:
                raise WeatherAuthError("Invalid OpenWeather API key") from e
            if status == 429:
                raise WeatherRateLimitError("OpenWeather rate limit exceeded") from e

            raise WeatherUpstreamError(f"OpenWeather API error: {status}") from e

        except httpx.RequestError as e:
            logger.exception("OpenWeather GEO request failed path='%s'", path)
            raise WeatherUpstreamError("OpenWeather geocoding is unreachable") from e

    def search_cities(self, query: str, limit: int = 5) -> list[CitySuggestionData]:
        logger.info("Searching city suggestions for query='%s', limit=%s", query, limit)

        raw = self._get_geo(
            "/direct",
            params={
                "q": query,
                "limit": limit,
                "appid": self.api_key,
            },
        )

        if not isinstance(raw, list):
            return []

        suggestions: list[CitySuggestionData] = []

        for item in raw:
            if not isinstance(item, dict):
                continue

            name = str(item.get("name") or "").strip()
            country = str(item.get("country") or "").strip()
            state_raw = item.get("state")
            lat_raw = item.get("lat")
            lon_raw = item.get("lon")

            if not name or not country:
                continue

            state = str(state_raw).strip() if isinstance(state_raw, str) and state_raw.strip() else None
            lat = float(lat_raw) if isinstance(lat_raw, (int, float)) else None
            lon = float(lon_raw) if isinstance(lon_raw, (int, float)) else None

            suggestions.append(
                CitySuggestionData(
                    name=name,
                    country=country,
                    state=state,
                    lat=lat,
                    lon=lon,
                )
            )

        return suggestions