from app.cache.weather_cache_protocol import WeatherCacheProtocol
from app.clients.weather_client import WeatherClient
from app.mappers.forecast_mapper import ForecastMapper
from app.schemas.weather import CurrentWeatherResponse, ForecastResponse


class WeatherService:
    def __init__(self, client: WeatherClient, cache: WeatherCacheProtocol) -> None:
        self.client = client
        self.cache = cache

    def get_current_weather(self, location: str) -> CurrentWeatherResponse:
        key = self.cache.make_key(location)

        cached = self.cache.get_current(key)
        if cached is not None:
            return cached

        current = self.client.get_current_weather(location)

        result = CurrentWeatherResponse(
            city=current.city,
            temp_c=current.temp_c,
            feels_like_c=current.feels_like_c,
            description=current.description,
            wind_speed=current.wind_speed,
            humidity=current.humidity,
        )

        self.cache.set_current(key, result)
        return result

    def get_forecast(self, location: str) -> ForecastResponse:
        key = self.cache.make_key(location)

        cached = self.cache.get_forecast(key)
        if cached is not None:
            return cached

        forecast = self.client.get_forecast(location)
        days = ForecastMapper.build_days(forecast.items)

        result = ForecastResponse(city=forecast.city, days=days)

        self.cache.set_forecast(key, result)
        return result