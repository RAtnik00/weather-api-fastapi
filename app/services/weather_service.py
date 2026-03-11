import logging

from app.cache.weather_cache_protocol import WeatherCacheProtocol
from app.clients.weather_client import WeatherClient
from app.mappers.current_weather_mapper import CurrentWeatherMapper
from app.mappers.forecast_mapper import ForecastMapper
from app.schemas.weather import CurrentWeatherResponse, ForecastResponse

logger = logging.getLogger(__name__)


class WeatherService:
    def __init__(self, client: WeatherClient, cache: WeatherCacheProtocol) -> None:
        self.client = client
        self.cache = cache

    def get_current_weather(self, location: str) -> CurrentWeatherResponse:
        key = self.cache.make_key(location)

        cached = self.cache.get_current(key)
        if cached is not None:
            logger.info("Current weather cache hit for key='%s'", key)
            return CurrentWeatherMapper.to_response(cached)

        logger.info("Current weather cache miss for key='%s'", key)
        current = self.client.get_current_weather(location)
        self.cache.set_current(key, current)

        return CurrentWeatherMapper.to_response(current)

    def get_forecast(self, location: str) -> ForecastResponse:
        key = self.cache.make_key(location)

        cached = self.cache.get_forecast(key)
        if cached is not None:
            logger.info("Forecast cache hit for key='%s'", key)
            return ForecastResponse(
                city=cached.city,
                days=ForecastMapper.build_days(cached.items),
            )

        logger.info("Forecast cache miss for key='%s'", key)
        forecast = self.client.get_forecast(location)
        self.cache.set_forecast(key, forecast)

        return ForecastResponse(
            city=forecast.city,
            days=ForecastMapper.build_days(forecast.items),
        )