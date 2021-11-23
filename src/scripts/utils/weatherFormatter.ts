import {
  IFetchedData,
  IFetchedHourlyData,
  IFetchedMinimalData,
  IFetchedWeeklyData,
} from "../interfaces/fetchedData";
import HourlyWeather from "../models/hourlyWeather";
import MinimalWeather from "../models/minimalWeather";
import Weather from "../models/weather";
import WeeklyWeather from "../models/weeklyWeather";

export default abstract class WeatherFormatter {
  static formatWeather = async (
    result: IFetchedData,
    cityName: string
  ): Promise<Weather> => {
    const weeklyWeather = await this.formatWeeklyWeather(result.daily);
    const hourlyWeather = await this.formatHourlyWeather(result.hourly);

    return new Weather({
      cityName,
      temperature: result.current.temp,
      sensedTemperature: result.current.feels_like,
      humidity: result.current.humidity,
      wind: result.current.wind_speed,
      pressure: result.current.pressure,
      uv: result.current.uvi,
      description: result.current.weather[0].main,
      iconCode: result.current.weather[0].icon,
      weeklyWeatherArray: weeklyWeather,
      hourlyWeatherArray: hourlyWeather,
    });
  };

  static formatHourlyWeather = async (
    hourlyData: IFetchedHourlyData[]
  ): Promise<HourlyWeather[]> => {
    return new Promise((resolve) => {
      const formattedArray = [];

      for (let i = 0; i < 24; i++) {
        formattedArray.push(
          new HourlyWeather({
            temperature: hourlyData[i].temp,
            wind: hourlyData[i].wind_speed,
            description: hourlyData[i].weather[0].main,
            humidity: hourlyData[i].humidity,
            dt: hourlyData[i].dt,
          })
        );
      }

      resolve(formattedArray);
    });
  };

  static formatWeeklyWeather = async (
    weeklyData: IFetchedWeeklyData[]
  ): Promise<WeeklyWeather[]> => {
    return new Promise((resolve) => {
      const formattedArray = [];

      for (let i = 1; i < 8; i++) {
        formattedArray.push(
          new WeeklyWeather({
            minTemperature: weeklyData[i].temp.min,
            maxTemperature: weeklyData[i].temp.max,
            description: weeklyData[i].weather[0].main,
            iconCode: weeklyData[i].weather[0].icon,
          })
        );
      }

      resolve(formattedArray);
    });
  };

  static formatMinimalWeather = async (
    result: IFetchedMinimalData,
    cityName: string
  ): Promise<MinimalWeather> => {
    return new MinimalWeather({
      cityName,
      temperature: result.current.temp,
      description: result.current.weather[0].main,
      iconCode: result.current.weather[0].icon,
    });
  };
}
