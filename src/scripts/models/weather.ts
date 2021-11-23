import { IWeather } from "../interfaces/weather";
import HourlyWeather from "./hourlyWeather";
import MinimalWeather from "./minimalWeather";
import WeeklyWeather from "./weeklyWeather";

interface IWeatherArguments {
  cityName: string;
  temperature: number;
  sensedTemperature: number;
  humidity: number;
  wind: number;
  pressure: number;
  uv: number;
  description: string;
  iconCode: string;
  weeklyWeatherArray: WeeklyWeather[];
  hourlyWeatherArray: HourlyWeather[];
}

export default class Weather extends MinimalWeather implements IWeather {
  sensedTemperature: number;
  humidity: number;
  wind: number;
  pressure: number;
  uv: number;
  weeklyWeatherArray: WeeklyWeather[];
  hourlyWeatherArray: HourlyWeather[];

  constructor({
    cityName,
    temperature,
    sensedTemperature,
    humidity,
    wind,
    pressure,
    uv,
    description,
    iconCode,
    weeklyWeatherArray,
    hourlyWeatherArray,
  }: IWeatherArguments) {
    super({ cityName, temperature, description, iconCode });
    this.sensedTemperature = Math.round(sensedTemperature);
    this.humidity = humidity;
    this.wind = wind;
    this.pressure = pressure;
    this.uv = uv;
    this.weeklyWeatherArray = weeklyWeatherArray;
    this.hourlyWeatherArray = hourlyWeatherArray;
  }
}
