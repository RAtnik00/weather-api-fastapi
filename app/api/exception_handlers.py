from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions.weather import (
    CityNotFoundError,
    WeatherAuthError,
    WeatherRateLimitError,
    WeatherUpstreamError,
)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(CityNotFoundError)
    async def city_not_found_handler(_: Request, exc: CityNotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(WeatherAuthError)
    async def weather_auth_handler(_: Request, __: WeatherAuthError) -> JSONResponse:
        return JSONResponse(
            status_code=502,
            content={"detail": "Weather provider authentication failed"},
        )

    @app.exception_handler(WeatherRateLimitError)
    async def weather_rate_limit_handler(_: Request, __: WeatherRateLimitError) -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={"detail": "Weather provider rate limit exceeded"},
        )

    @app.exception_handler(WeatherUpstreamError)
    async def weather_upstream_handler(_: Request, __: WeatherUpstreamError) -> JSONResponse:
        return JSONResponse(status_code=502, content={"detail": "Weather provider error"})