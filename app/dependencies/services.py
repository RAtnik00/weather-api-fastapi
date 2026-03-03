from fastapi import Depends

from app.clients.openweather_client import OpenWeatherClient
from app.core.config import OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL
from app.services.weather_service import WeatherService
from app.cache.weather_cache import WeatherCache

_weather_cache = WeatherCache()

def get_weather_cache() -> WeatherCache:
    return _weather_cache

def get_openweather_client() -> OpenWeatherClient:
    return OpenWeatherClient(OPENWEATHER_BASE_URL, OPENWEATHER_API_KEY)

def get_weather_service(
        client: OpenWeatherClient = Depends(get_openweather_client),
        cache: WeatherCache = Depends(get_weather_cache),
) -> WeatherService:
    return WeatherService(client, cache)