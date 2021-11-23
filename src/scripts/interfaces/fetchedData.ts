export interface IFetchedData {
  lat: number;
  lon: number;
  daily: IFetchedWeeklyData[];
  hourly: IFetchedHourlyData[];
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    pressure: number;
    uvi: number;
    weather: { main: string; icon: string }[];
  };
}

export interface IFetchedHourlyData {
  temp: number;
  wind_speed: number;
  weather: { main: string }[];
  humidity: number;
  dt: number;
}

export interface IFetchedWeeklyData {
  temp: {
    min: number;
    max: number;
  };
  weather: { main: string; icon: string }[];
}

export interface IFetchedMinimalData {
  lat: number;
  lon: number;
  current: {
    temp: number;
    weather: { main: string; icon: string }[];
  };
}
