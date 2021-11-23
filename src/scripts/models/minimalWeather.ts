import { IMinimalWeather } from "../interfaces/weather";
import { getIcon } from "../utils/icons";

interface IMinimalWeatherArguments {
  cityName: string;
  temperature: number;
  description: string;
  iconCode: string;
}

export default class MinimalWeather implements IMinimalWeather {
  cityName: string;
  temperature: number;
  description: string;
  icon: string;

  constructor({
    cityName,
    temperature,
    description,
    iconCode,
  }: IMinimalWeatherArguments) {
    this.cityName = cityName;
    this.temperature = Math.round(temperature);
    this.description = description;
    this.icon = getIcon(iconCode);
  }
}
