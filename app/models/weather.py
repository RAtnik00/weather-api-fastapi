from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class CurrentWeatherData:
    city: str
    temp_c: float
    feels_like_c: float
    description: str
    wind_speed: float
    humidity: int | None = None


@dataclass(frozen=True)
class ForecastItemData:
    forecast_date: date
    temp_c: float | None
    wind_speed: float | None
    description: str | None


@dataclass(frozen=True)
class ForecastData:
    city: str
    items: list[ForecastItemData]

@dataclass(frozen=True)
class CitySuggestionData:
    name: str
    country: str
    state: str | None = None
    lat: float | None = None
    lon: float | None = None