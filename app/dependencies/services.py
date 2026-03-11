from functools import lru_cache

from app.cache.weather_cache import WeatherCache
from app.clients.openweather_client import OpenWeatherClient
from app.core.config import settings
from app.services.weather_service import WeatherService


@lru_cache
def get_weather_cache() -> WeatherCache:
    return WeatherCache()


@lru_cache
def get_weather_client() -> OpenWeatherClient:
    return OpenWeatherClient(
        base_url=settings.openweather_base_url,
        api_key=settings.openweather_api_key,
    )


def get_weather_service() -> WeatherService:
    return WeatherService(
        client=get_weather_client(),
        cache=get_weather_cache(),
    )