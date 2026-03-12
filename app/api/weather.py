from fastapi import APIRouter, Depends, Query, Request, Response

from app.dependencies.services import get_weather_service
from app.dependencies.cookies import get_cookies_service
from app.schemas.weather import CurrentWeatherResponse, ForecastResponse
from app.services.weather_service import WeatherService
from app.services.cookies_service import CookiesService

router = APIRouter()


@router.get("/")
def health_check():
    return {"status": "ok"}


@router.get("/weather/current", response_model=CurrentWeatherResponse)
def current_weather(
    request: Request,
    response: Response,
    location: str = Query(..., min_length=2, max_length=64, strip_whitespace=True),
    service: WeatherService = Depends(get_weather_service),
    cookies_service: CookiesService = Depends(get_cookies_service),
):
    result = service.get_current_weather(location)

    history = cookies_service.get_history(request.cookies)
    history = cookies_service.add_to_history(history, result.city)

    response.set_cookie(
        key=cookies_service.HISTORY_KEY,
        value=cookies_service.encode_history(history),
        httponly=True,
        samesite="lax",
    )
    return result


@router.get("/weather/forecast", response_model=ForecastResponse)
def forecast_weather(
    location: str = Query(..., min_length=2, max_length=64, strip_whitespace=True),
    service: WeatherService = Depends(get_weather_service),
):
    return service.get_forecast(location)


@router.get("/weather/current/by-coords", response_model=CurrentWeatherResponse)
def current_weather_by_coords(
    request: Request,
    response: Response,
    lat: float = Query(...),
    lon: float = Query(...),
    service: WeatherService = Depends(get_weather_service),
    cookies_service: CookiesService = Depends(get_cookies_service),
):
    result = service.get_current_weather_by_coords(lat=lat, lon=lon)

    history = cookies_service.get_history(request.cookies)
    history = cookies_service.add_to_history(history, result.city)

    response.set_cookie(
        key=cookies_service.HISTORY_KEY,
        value=cookies_service.encode_history(history),
        httponly=True,
        samesite="lax",
    )
    return result


@router.get("/weather/forecast/by-coords", response_model=ForecastResponse)
def forecast_weather_by_coords(
    lat: float = Query(...),
    lon: float = Query(...),
    service: WeatherService = Depends(get_weather_service),
):
    return service.get_forecast_by_coords(lat=lat, lon=lon)


@router.get("/history")
def get_history(
    request: Request,
    cookies_service: CookiesService = Depends(get_cookies_service),
):
    history = cookies_service.get_history(request.cookies)
    return {"history": history}


@router.get("/favorites")
def get_favorites(
    request: Request,
    cookies_service: CookiesService = Depends(get_cookies_service),
):
    favorites = cookies_service.get_favorites(request.cookies)
    return {"favorites": favorites}


@router.post("/favorites/{location}")
def add_favorite(
    location: str,
    request: Request,
    response: Response,
    cookies_service: CookiesService = Depends(get_cookies_service),
):
    favorites = cookies_service.get_favorites(request.cookies)
    favorites = cookies_service.add_favorite(favorites, location)

    response.set_cookie(
        key=cookies_service.FAVORITES_KEY,
        value=cookies_service.encode_favorites(favorites),
        httponly=True,
        samesite="lax",
    )
    return {"favorites": favorites}


@router.delete("/favorites/{location}")
def remove_favorite(
    location: str,
    request: Request,
    response: Response,
    cookies_service: CookiesService = Depends(get_cookies_service),
):
    favorites = cookies_service.get_favorites(request.cookies)
    favorites = cookies_service.remove_favorite(favorites, location)

    response.set_cookie(
        key=cookies_service.FAVORITES_KEY,
        value=cookies_service.encode_favorites(favorites),
        httponly=True,
        samesite="lax",
    )
    return {"favorites": favorites}