import Weather from "./weather";
import { IFavouriteObject } from "../interfaces/favouriteObject";

export default class Model {
  weather!: Weather;
  initialCity: string | null;
  favouriteCities: IFavouriteObject[];
  onFavouritesListChanged!: (fav: IFavouriteObject[]) => void;
  getFavouriteObjectsFromNames!: (
    cities: string[]
  ) => Promise<IFavouriteObject[]>;

  constructor() {
    this.initialCity = localStorage.getItem("initialCity");
    this.favouriteCities = [];
  }

  bindFavouritesListChanged = (
    callback: (fav: IFavouriteObject[]) => void
  ): void => {
    this.onFavouritesListChanged = callback;
  };

  bindGetFavouriteObjectsFromNames = (
    callback: (cities: string[]) => Promise<IFavouriteObject[]>
  ): void => {
    this.getFavouriteObjectsFromNames = callback;
  };

  setWeather = (weatherObj: Weather): void => {
    this.weather = weatherObj;
  };

  getCurrentCityName = (): string => {
    return this.weather.cityName;
  };

  setInitialCity = (cityName: string): void => {
    this.initialCity = cityName;
    localStorage.setItem("initialCity", cityName);
  };

  addFavouriteCity = (newFavouriteCity: IFavouriteObject): void => {
    this.favouriteCities.push(newFavouriteCity);
    this.saveFavouriteCitiesInStorage();

    this.onFavouritesListChanged(this.favouriteCities);
  };

  deleteFavouriteCity = (cityName: string): void => {
    this.favouriteCities = this.favouriteCities.filter(
      (city) => city.cityName !== cityName
    );

    this.saveFavouriteCitiesInStorage();

    this.onFavouritesListChanged(this.favouriteCities);
  };

  saveFavouriteCitiesInStorage = (): void => {
    const cityNames = this.favouriteCities.map((city) => city.cityName);
    localStorage.setItem("cities", JSON.stringify(cityNames));
  };

  isCityInFavourites = (cityName: string): boolean => {
    return this.favouriteCities.some((city) => city.cityName == cityName);
  };

  getFavouriteCitiesCount = (): number => {
    return this.favouriteCities.length;
  };

  getFavouriteCitiesFromLocalStorage = async (): Promise<void> => {
    const storedCityNames = localStorage.getItem("cities");

    if (storedCityNames) {
      const storedFavourites = JSON.parse(storedCityNames);

      const favouriteObjects = await this.getFavouriteObjectsFromNames(
        storedFavourites
      );

      favouriteObjects.forEach((favouriteObject) => {
        this.favouriteCities.push(favouriteObject);
      });
    }

    this.onFavouritesListChanged(this.favouriteCities);
  };
}
