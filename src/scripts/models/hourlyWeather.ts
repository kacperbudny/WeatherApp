import { IHourlyWeather } from "../interfaces/weather";

interface IHourlyWeatherArguments {
  temperature: number;
  dt: number;
  wind: number;
  humidity: number;
  description: string;
}

export default class HourlyWeather implements IHourlyWeather {
  temperature: number;
  date: number;
  wind: number;
  humidity: number;
  description: string;

  constructor({
    temperature,
    wind,
    humidity,
    description,
    dt,
  }: IHourlyWeatherArguments) {
    this.temperature = temperature;
    this.date = dt;
    this.wind = wind;
    this.humidity = humidity;
    this.description = description;
  }
}
