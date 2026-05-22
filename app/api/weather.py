from fastapi import APIRouter, Depends, Query

from app.dependencies.services import get_weather_service
from app.schemas.weather import (
    CitySuggestionResponse,
    CurrentWeatherResponse,
    ForecastResponse,
)
from app.services.weather_service import WeatherService

router = APIRouter()


@router.get("/")
def health_check():
    return {"status": "ok"}


@router.get("/weather/current", response_model=CurrentWeatherResponse)
def current_weather(
    location: str = Query(..., min_length=2, max_length=64, strip_whitespace=True),
    service: WeatherService = Depends(get_weather_service),
):
    return service.get_current_weather(location)


@router.get("/weather/forecast", response_model=ForecastResponse)
def forecast_weather(
    location: str = Query(..., min_length=2, max_length=64, strip_whitespace=True),
    service: WeatherService = Depends(get_weather_service),
):
    return service.get_forecast(location)


@router.get("/weather/current/by-coords", response_model=CurrentWeatherResponse)
def current_weather_by_coords(
    lat: float = Query(...),
    lon: float = Query(...),
    service: WeatherService = Depends(get_weather_service),
):
    return service.get_current_weather_by_coords(lat=lat, lon=lon)


@router.get("/weather/forecast/by-coords", response_model=ForecastResponse)
def forecast_weather_by_coords(
    lat: float = Query(...),
    lon: float = Query(...),
    service: WeatherService = Depends(get_weather_service),
):
    return service.get_forecast_by_coords(lat=lat, lon=lon)


@router.get("/weather/cities", response_model=list[CitySuggestionResponse])
def search_cities(
    q: str = Query(..., min_length=2, max_length=64, strip_whitespace=True),
    limit: int = Query(5, ge=1, le=10),
    service: WeatherService = Depends(get_weather_service),
):
    return service.search_cities(query=q, limit=limit)
