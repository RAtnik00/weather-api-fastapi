import type { CurrentWeather, ForecastDay } from '@/types/weather';

export const mockCurrentWeather: CurrentWeather = {
  city: 'Warsaw',
  temperature: 5,
  description: 'Clear sky',
  feelsLike: 3,
  windSpeed: 2,
  humidity: 55,
};

export const mockForecast: ForecastDay[] = [
  {
    day: 'Today',
    min: 5,
    max: 5,
    windSpeed: 2,
    description: 'Clear sky',
  },
  {
    day: 'Thursday',
    min: 2,
    max: 12,
    windSpeed: 3,
    description: 'Overcast clouds',
  },
  {
    day: 'Friday',
    min: 5,
    max: 19,
    windSpeed: 3,
    description: 'Scattered clouds',
  },
  {
    day: 'Saturday',
    min: 9,
    max: 23,
    windSpeed: 2,
    description: 'Clear sky',
  },
  {
    day: 'Sunday',
    min: 12,
    max: 24,
    windSpeed: 3,
    description: 'Clear sky',
  },
];
