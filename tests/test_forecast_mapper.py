from datetime import date

from app.mappers.forecast_mapper import ForecastMapper
from app.models.weather import ForecastItemData


def test_build_days_groups_items_and_calculates_aggregates():
    items = [
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
        ForecastItemData(
            forecast_date=date(2026, 3, 12),
            temp_c=8.0,
            wind_speed=3.0,
            description="rain",
        ),
        ForecastItemData(
            forecast_date=date(2026, 3, 12),
            temp_c=12.0,
            wind_speed=5.0,
            description="sunny",
        ),
        ForecastItemData(
            forecast_date=date(2026, 3, 12),
            temp_c=11.0,
            wind_speed=4.0,
            description="rain",
        ),
    ]

    result = ForecastMapper.build_days(items)

    assert len(result) == 2

    day1 = result[0]
    assert day1.date == date(2026, 3, 11)
    assert day1.temp_min_c == 10.0
    assert day1.temp_max_c == 14.0
    assert day1.wind_speed_avg == 5.0
    assert day1.description == "cloudy"

    day2 = result[1]
    assert day2.date == date(2026, 3, 12)
    assert day2.temp_min_c == 8.0
    assert day2.temp_max_c == 12.0
    assert day2.wind_speed_avg == 4.0
    assert day2.description == "rain"


def test_build_days_limits_result_to_five_days():
    items = [
        ForecastItemData(
            forecast_date=date(2026, 3, 11 + i),
            temp_c=10.0 + i,
            wind_speed=3.0 + i,
            description="clear",
        )
        for i in range(6)
    ]

    result = ForecastMapper.build_days(items)

    assert len(result) == 5
    assert result[0].date == date(2026, 3, 11)
    assert result[-1].date == date(2026, 3, 15)


def test_build_days_handles_missing_values():
    items = [
        ForecastItemData(
            forecast_date=date(2026, 3, 11),
            temp_c=None,
            wind_speed=None,
            description=None,
        )
    ]

    result = ForecastMapper.build_days(items)

    assert len(result) == 1
    assert result[0].date == date(2026, 3, 11)
    assert result[0].temp_min_c is None
    assert result[0].temp_max_c is None
    assert result[0].wind_speed_avg is None
    assert result[0].description is None