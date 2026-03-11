from functools import lru_cache

from app.cache.weather_cache import WeatherCache
from app.clients.openweather_client import OpenWeatherClient
from app.core import config
from app.services.weather_service import WeatherService


@lru_cache
def get_weather_cache() -> WeatherCache:
    return WeatherCache()


@lru_cache
def get_weather_client() -> OpenWeatherClient:
    return OpenWeatherClient(
        base_url=config.OPENWEATHER_BASE_URL,
        api_key=config.OPENWEATHER_API_KEY,
    )


def get_weather_service() -> WeatherService:
    client = get_weather_client()
    cache = get_weather_cache()
    return WeatherService(
        client=client,
        cache=cache,
    )