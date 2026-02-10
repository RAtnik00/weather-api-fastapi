from fastapi import Query

from fastapi import APIRouter
from app.services.weather import WeatherService


router = APIRouter()
service = WeatherService()

@router.get("/")
def health_check():
    return {"status": "ok"}

@router.get("/weather")
def weather(location: str = Query()):
    result = service.get_current_weather(location)
    return {"result": result}
