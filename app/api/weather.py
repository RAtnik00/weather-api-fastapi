from fastapi import Query

from fastapi import APIRouter
from fastapi import Depends
from app.dependencies.services import get_weather_service
from app.services.weather_service import WeatherService

router = APIRouter()

@router.get("/")
def health_check():
    return {"status": "ok"}

@router.get("/weather/current")
def current_weather(location: str = Query(...), service: WeatherService = Depends(get_weather_service)):
    result = service.get_current_weather(location)
    return result

@router.get("/weather/forecast")
def forecast_weather(location: str = Query(...), service: WeatherService = Depends(get_weather_service)):
    result = service.get_forecast(location)
    return result

@router.get("/weather/yesterday")
def yesterday_weather(location: str = Query(...), service: WeatherService = Depends(get_weather_service)):
    result = service.get_yesterday_weather(location)
    return result