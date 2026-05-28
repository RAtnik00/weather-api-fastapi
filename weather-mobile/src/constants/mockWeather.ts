export const mockCurrentWeather = {
  city: 'Warsaw',
  temperature: 5,
  description: 'Clear sky',
  feelsLike: 3,
  windSpeed: 2,
} as const;

export const mockForecast = [
  {
    day: 'Today',
    min: 5,
    max: 5,
  },
  {
    day: 'Thursday',
    min: 2,
    max: 12,
  },
  {
    day: 'Friday',
    min: 5,
    max: 19,
  },
  {
    day: 'Saturday',
    min: 9,
    max: 23,
  },
  {
    day: 'Sunday',
    min: 12,
    max: 24,
  },
] as const;
