from collections import Counter, defaultdict
from datetime import datetime, date
from statistics import mean

from app.clients.weather_client import WeatherClient
from app.schemas.weather import CurrentWeatherResponse, ForecastDay, ForecastResponse
from app.cache.weather_cache import WeatherCache

class WeatherService:
    def __init__(self, client: WeatherClient, cache: WeatherCache) -> None:
        self.client = client
        self.cache = cache

    def get_current_weather(self, location: str) -> CurrentWeatherResponse:
        raw = self.client.get_current_weather(location)
        return CurrentWeatherResponse(
            city=raw["name"],
            temp_c=raw["main"]["temp"],
            feels_like_c=raw["main"]["feels_like"],
            description=raw["weather"][0]["description"],
            wind_speed=raw["wind"]["speed"],
        )

    def get_forecast(self, location: str) -> ForecastResponse:
        raw = self.client.get_forecast(location)

        city = (raw.get("city") or {}).get("name") or location
        items = raw.get("list") or []

        by_day_temps: dict[date, list[float]] = defaultdict(list)
        by_day_winds: dict[date, list[float]] = defaultdict(list)
        by_day_desc: dict[date, list[str]] = defaultdict(list)

        for it in items:
            dt_txt = it.get("dt_txt")
            if not dt_txt:
                continue

            d = datetime.strptime(dt_txt, "%Y-%m-%d %H:%M:%S").date()

            main = it.get("main") or {}
            temp = main.get("temp")
            if isinstance(temp, (int, float)):
                by_day_temps[d].append(float(temp))

            wind = (it.get("wind") or {}).get("speed")
            if isinstance(wind, (int, float)):
                by_day_winds[d].append(float(wind))

            weather_arr = it.get("weather") or []
            if weather_arr and isinstance(weather_arr, list):
                desc = (weather_arr[0] or {}).get("description")
                if isinstance(desc, str) and desc.strip():
                    by_day_desc[d].append(desc.strip())

        days_sorted = sorted(by_day_temps.keys() | by_day_winds.keys() | by_day_desc.keys())[:5]

        result_days: list[ForecastDay] = []
        for d in days_sorted:
            temps = by_day_temps.get(d, [])
            winds = by_day_winds.get(d, [])
            descs = by_day_desc.get(d, [])

            result_days.append(
                ForecastDay(
                    date=d,
                    temp_min_c=round(min(temps), 1) if temps else None,
                    temp_max_c=round(max(temps), 1) if temps else None,
                    wind_speed_avg=round(mean(winds), 1) if winds else None,
                    description=Counter(descs).most_common(1)[0][0] if descs else None,
                )
            )

        return ForecastResponse(city=city, days=result_days)