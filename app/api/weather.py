from fastapi import Query

from fastapi import APIRouter
from app.services.weather import WeatherService


router = APIRouter()
service = WeatherService()

@router.get("/")
def health_check():
    return {"status": "ok"}

@router.get("/weather/current")
def current_weather(location: str = Query(...)):
    result = service.get_current_weather(location)
    return result

@router.get("/weather/forecast")
def forecast_weather(location: str = Query(...)):
    result = service.get_forecast(location)
    return result

@router.get("/weather/yesterday")
def yesterday_weather(location: str = Query(...)):
    result = service.get_yesterday_weather(location)
    return result