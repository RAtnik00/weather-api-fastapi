from pydantic import BaseModel

class CurrentWeatherResponse(BaseModel):
    city: str
    temp_c: float
    feels_like_c: float
    description: str
    wind_speed: float
