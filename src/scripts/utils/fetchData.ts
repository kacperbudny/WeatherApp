import { IFetchedData, IFetchedMinimalData } from "../interfaces/fetchedData";
import { ICoordinates } from "../interfaces/coordinates";

const appId = process.env.API_KEY;
const baseUrl = "https://api.openweathermap.org";

export async function getCoordinates(cityName: string): Promise<ICoordinates> {
  const response = await fetch(
    `${baseUrl}/geo/1.0/direct?q=${cityName}&appid=${appId}`
  );
  const result = await response.json();
  return { lat: result[0].lat, lon: result[0].lon };
}

export async function getCityNameFromCoordinates({
  lat,
  lon,
}: ICoordinates): Promise<string> {
  const response = await fetch(
    `${baseUrl}/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${appId}`
  );
  const result = await response.json();
  return result[0].name;
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<IFetchedData> {
  const response = await fetch(
    `${baseUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${appId}&units=metric`
  );
  const result = await response.json();

  return result;
}

export async function fetchMinimalWeather(
  lat: number,
  lon: number
): Promise<IFetchedMinimalData> {
  const response = await fetch(
    `${baseUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,hourly,alerts&appid=${appId}&units=metric`
  );
  const result = await response.json();

  return result;
}
