export interface IMinimalWeather {
  cityName: string;
  temperature: number;
  description: string;
  icon: string;
}

export interface IWeather extends IMinimalWeather {
  sensedTemperature: number;
  humidity: number;
  wind: number;
  pressure: number;
  uv: number;
  weeklyWeatherArray: IWeeklyWeather[];
  hourlyWeatherArray: IHourlyWeather[];
}

export interface IHourlyWeather {
  temperature: number;
  date: number;
  wind: number;
  humidity: number;
  description: string;
}

export interface IWeeklyWeather {
  minTemperature: number;
  maxTemperature: number;
  description: string;
  icon: string;
}
