from datetime import date

from pydantic import BaseModel


class CurrentWeatherResponse(BaseModel):
    city: str
    temp_c: float
    feels_like_c: float
    description: str
    wind_speed: float
    humidity: int | None = None


class ForecastDay(BaseModel):
    date: date
    temp_min_c: float | None = None
    temp_max_c: float | None = None
    wind_speed_avg: float | None = None
    description: str | None = None


class ForecastResponse(BaseModel):
    city: str
    days: list[ForecastDay]

class CitySuggestionResponse(BaseModel):
    name: str
    country: str
    state: str | None = None
    lat: float | None = None
    lon: float | None = None