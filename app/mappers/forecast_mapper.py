from collections import Counter, defaultdict
from statistics import mean

from app.models.weather import ForecastItemData
from app.schemas.weather import ForecastDay


class ForecastMapper:
    @staticmethod
    def build_days(items: list[ForecastItemData]) -> list[ForecastDay]:
        by_day_temps, by_day_winds, by_day_desc = ForecastMapper._group_by_day(items)

        days_sorted = sorted(
            by_day_temps.keys() | by_day_winds.keys() | by_day_desc.keys()
        )[:5]

        result_days: list[ForecastDay] = []

        for day in days_sorted:
            temps = by_day_temps.get(day, [])
            winds = by_day_winds.get(day, [])
            descriptions = by_day_desc.get(day, [])

            result_days.append(
                ForecastDay(
                    date=day,
                    temp_min_c=round(min(temps), 1) if temps else None,
                    temp_max_c=round(max(temps), 1) if temps else None,
                    wind_speed_avg=round(mean(winds), 1) if winds else None,
                    description=ForecastMapper._select_description(descriptions),
                )
            )

        return result_days

    @staticmethod
    def _group_by_day(items: list[ForecastItemData]):
        by_day_temps = defaultdict(list)
        by_day_winds = defaultdict(list)
        by_day_desc = defaultdict(list)

        for item in items:
            if item.temp_c is not None:
                by_day_temps[item.forecast_date].append(item.temp_c)

            if item.wind_speed is not None:
                by_day_winds[item.forecast_date].append(item.wind_speed)

            if item.description:
                by_day_desc[item.forecast_date].append(item.description)

        return by_day_temps, by_day_winds, by_day_desc

    @staticmethod
    def _select_description(descriptions: list[str]) -> str | None:
        if not descriptions:
            return None
        return Counter(descriptions).most_common(1)[0][0]