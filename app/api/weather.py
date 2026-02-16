from fastapi import Query, APIRouter, Depends, Request, Response

from app.dependencies.services import get_weather_service
from app.services.weather_service import WeatherService
from app.services.cookies_service import CookiesService

router = APIRouter()

cookies_service = CookiesService()

@router.get("/")
def health_check():
    return {"status": "ok"}

@router.get("/weather/current")
def current_weather(
    request: Request,
    response: Response,
    location: str = Query(...),
    service: WeatherService = Depends(get_weather_service),
):
    result = service.get_current_weather(location)
    history = cookies_service.get_history(request.cookies)
    history = cookies_service.add_to_history(history, location)
    response.set_cookie(
        key=cookies_service.HISTORY_KEY,
        value=cookies_service.encode_history(history),
        httponly=True,
        samesite="lax",
    )
    return result

@router.get("/weather/forecast")
def forecast_weather(location: str = Query(...), service: WeatherService = Depends(get_weather_service)):
    result = service.get_forecast(location)
    return result

@router.get("/weather/yesterday")
def yesterday_weather(location: str = Query(...), service: WeatherService = Depends(get_weather_service)):
    result = service.get_yesterday_weather(location)
    return result

@router.get("/history")
def get_history(request: Request):
    history = cookies_service.get_history(request.cookies)
    return {"history": history}

@router.get("/favorites")
def get_favorites(request: Request):
    favorites = cookies_service.get_favorites(request.cookies)
    return {"favorites": favorites}