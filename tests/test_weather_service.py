from datetime import date

from app.models.weather import CurrentWeatherData, ForecastData, ForecastItemData
from app.services.weather_service import WeatherService


class FakeWeatherClient:
    def __init__(self):
        self.current_calls = 0
        self.forecast_calls = 0

    def get_current_weather(self, location: str) -> CurrentWeatherData:
        self.current_calls += 1
        return CurrentWeatherData(
            city=location,
            temp_c=12.5,
            feels_like_c=10.0,
            description="cloudy",
            wind_speed=5.5,
            humidity=77,
        )

    def get_forecast(self, location: str) -> ForecastData:
        self.forecast_calls += 1
        return ForecastData(
            city=location,
            items=[
                ForecastItemData(
                    forecast_date=date(2026, 3, 11),
                    temp_c=10.0,
                    wind_speed=4.0,
                    description="cloudy",
                ),
                ForecastItemData(
                    forecast_date=date(2026, 3, 11),
                    temp_c=14.0,
                    wind_speed=6.0,
                    description="cloudy",
                ),
            ],
        )


class FakeWeatherCache:
    def __init__(self):
        self.current_data = {}
        self.forecast_data = {}

    def make_key(self, location: str) -> str:
        return location.strip().lower()

    def get_current(self, key: str):
        return self.current_data.get(key)

    def set_current(self, key: str, value) -> None:
        self.current_data[key] = value

    def get_forecast(self, key: str):
        return self.forecast_data.get(key)

    def set_forecast(self, key: str, value) -> None:
        self.forecast_data[key] = value


def test_get_current_weather_returns_mapped_response():
    client = FakeWeatherClient()
    cache = FakeWeatherCache()
    service = WeatherService(client=client, cache=cache)

    result = service.get_current_weather("Warsaw")

    assert result.city == "Warsaw"
    assert result.temp_c == 12.5
    assert result.feels_like_c == 10.0
    assert result.description == "cloudy"
    assert result.wind_speed == 5.5
    assert result.humidity == 77
    assert client.current_calls == 1


def test_get_current_weather_uses_cache():
    client = FakeWeatherClient()
    cache = FakeWeatherCache()
    service = WeatherService(client=client, cache=cache)

    first = service.get_current_weather("Warsaw")
    second = service.get_current_weather("Warsaw")

    assert first.city == second.city
    assert client.current_calls == 1


def test_get_forecast_returns_aggregated_response():
    client = FakeWeatherClient()
    cache = FakeWeatherCache()
    service = WeatherService(client=client, cache=cache)

    result = service.get_forecast("Warsaw")

    assert result.city == "Warsaw"
    assert len(result.days) == 1
    assert result.days[0].date == date(2026, 3, 11)
    assert result.days[0].temp_min_c == 10.0
    assert result.days[0].temp_max_c == 14.0
    assert result.days[0].wind_speed_avg == 5.0
    assert result.days[0].description == "cloudy"
    assert client.forecast_calls == 1


def test_get_forecast_uses_cache():
    client = FakeWeatherClient()
    cache = FakeWeatherCache()
    service = WeatherService(client=client, cache=cache)

    first = service.get_forecast("Warsaw")
    second = service.get_forecast("Warsaw")

    assert first.city == second.city
    assert client.forecast_calls == 1