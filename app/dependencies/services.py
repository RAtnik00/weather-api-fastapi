from fastapi import Depends

from app.services.weather_service import WeatherService
from app.clients.openweather_client import OpenWeatherClient
from app.core.config import OPENWEATHER_BASE_URL, OPENWEATHER_API_KEY

def get_openweather_client() -> OpenWeatherClient:
    return OpenWeatherClient(OPENWEATHER_BASE_URL, OPENWEATHER_API_KEY)

def get_weather_service(client = Depends(get_openweather_client)) -> WeatherService:
    return WeatherService(client)