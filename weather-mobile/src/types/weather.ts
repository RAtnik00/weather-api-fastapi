export type CurrentWeather = {
  city: string;
  temperature: number;
  description: string;
  feelsLike: number;
  windSpeed: number;
  humidity: number | null;
};

export type ForecastDay = {
  day: string;
  min: number | null;
  max: number | null;
  windSpeed: number | null;
  description: string | null;
};

export type CitySuggestion = {
  name: string;
  country: string;
  state: string | null;
  lat: number | null;
  lon: number | null;
};
