from fastapi import Depends

from app.services.weather_service import WeatherService
from app.clients.openweather_client import OpenWeatherClient
from app.core.config import OPENWEATHER_BASE_URL, OPENWEATHER_API_KEY

def get_openweather_client():
    base_url = OPENWEATHER_BASE_URL
    api_key = OPENWEATHER_API_KEY
    return OpenWeatherClient(base_url, api_key)

def get_weather_service(client = Depends(get_openweather_client)):
    return WeatherService(client)