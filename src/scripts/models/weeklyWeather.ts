import { IWeeklyWeather } from "../interfaces/weather";
import { getIcon } from "../utils/icons";

interface IWeeklyWeatherArguments {
  minTemperature: number;
  maxTemperature: number;
  description: string;
  iconCode: string;
}

export default class WeeklyWeather implements IWeeklyWeather {
  minTemperature: number;
  maxTemperature: number;
  description: string;
  icon: string;

  constructor({
    minTemperature,
    maxTemperature,
    description,
    iconCode,
  }: IWeeklyWeatherArguments) {
    this.minTemperature = Math.round(minTemperature);
    this.maxTemperature = Math.round(maxTemperature);
    this.description = description;
    this.icon = getIcon(iconCode);
  }
}
