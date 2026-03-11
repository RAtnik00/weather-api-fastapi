from app.models.weather import CurrentWeatherData
from app.schemas.weather import CurrentWeatherResponse

class CurrentWeatherMapper:
    @staticmethod
    def to_response(data: CurrentWeatherData) -> CurrentWeatherResponse:
        return CurrentWeatherResponse(
            city=data.city,
            temp_c=data.temp_c,
            feels_like_c=data.feels_like_c,
            description=data.description,
            wind_speed=data.wind_speed,
            humidity=data.humidity,
        )