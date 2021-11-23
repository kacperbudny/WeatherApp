import {
  fetchMinimalWeather,
  fetchWeather,
  getCityNameFromCoordinates,
  getCoordinates,
} from "../utils/fetchData";
import Model from "../models/model";
import AppView from "../views/appView";
import Weather from "../models/weather";
import { IFavouriteObject } from "../interfaces/favouriteObject";
import WeatherFormatter from "../utils/weatherFormatter";
import MinimalWeather from "../models/minimalWeather";

export default class Controller {
  model: Model;
  view: AppView;

  constructor() {
    this.model = new Model();
    this.view = new AppView();

    this.view.searchView.bindSearch(this.handleSearch);
    this.view.favouritesView.bindToggleHeartButton(
      this.handleToggleHeartButton
    );
    this.view.favouritesView.bindClickFavouriteCity(this.updateCurrentCity);
    this.view.favouritesView.bindDeleteFavouriteCity(
      this.handleDeleteFavouriteCityButton
    );
    this.model.bindFavouritesListChanged(this.onFavouritesListChanged);
    this.model.bindGetFavouriteObjectsFromNames(
      this.handleGetFavouriteCitiesObjects
    );

    this.initCity();
  }

  handleSearch = (inputValue: string): void => {
    if (inputValue.trim()) {
      this.updateCurrentCity(inputValue);
    } else {
      this.view.notificationView.showNotification(
        "You have to enter a city name."
      );
    }
  };

  handleToggleHeartButton = (): void => {
    const currentCityName = this.model.getCurrentCityName();

    if (this.model.isCityInFavourites(currentCityName)) {
      this.handleDeleteFavouriteCity(currentCityName);
    } else {
      this.handleAddFavouriteCity(this.model.weather);
    }
  };

  handleAddFavouriteCity = (weatherModel: Weather): void => {
    if (this.model.getFavouriteCitiesCount() >= 5) {
      this.view.notificationView.showNotification(
        "You can have maximum of 5 favourite cities."
      );

      throw new Error("You can have maximum of 5 favourite cities.");
    }

    const newFavouriteCity = {
      cityName: weatherModel.cityName,
      icon: weatherModel.icon,
      weatherDescription: weatherModel.description,
      temperature: weatherModel.temperature,
    };

    this.model.addFavouriteCity(newFavouriteCity);
  };

  handleDeleteFavouriteCity = (cityName: string): void => {
    this.model.deleteFavouriteCity(cityName);
  };

  handleDeleteFavouriteCityButton = (cityName: string): void => {
    if (this.model.getCurrentCityName() == cityName) {
      this.view.favouritesView.swapFavouriteIcons();
    }

    this.model.deleteFavouriteCity(cityName);
  };

  handleGetFavouriteCitiesObjects = async (
    storedFavourites: string[]
  ): Promise<IFavouriteObject[]> => {
    const requests = storedFavourites.map((favourite: string) =>
      this.convertFavouriteCityToObject(favourite)
    );

    const responses: IFavouriteObject[] = await Promise.all(requests);

    return responses;
  };

  onFavouritesListChanged = (favourites: IFavouriteObject[]): void => {
    this.view.favouritesView.displayFavourites(favourites);
  };

  initCity = (): void => {
    const initialCity = this.model.initialCity;

    if (!initialCity) {
      this.getCityFromGeolocation();
    } else {
      this.initWeatherData(initialCity);
    }
  };

  initWeatherData = async (cityName: string): Promise<void> => {
    const result = await this.updateWeather(cityName);
    this.view.graphView.displayGraph(result.hourlyWeatherArray);
    this.model.setInitialCity(cityName);
    await this.model.getFavouriteCitiesFromLocalStorage();

    if (this.model.isCityInFavourites(this.model.getCurrentCityName())) {
      this.view.favouritesView.swapFavouriteIcons();
    }
    this.view.loadingView.hideLoadingIndicator();
  };

  getCityFromGeolocation = (): void => {
    const success = (position: GeolocationPosition) => {
      const coordsObj = {
        lat: position.coords.latitude.toFixed(1),
        lon: position.coords.longitude.toFixed(1),
      };

      getCityNameFromCoordinates({
        lat: +coordsObj.lat,
        lon: +coordsObj.lon,
      }).then((cityName) => {
        this.initWeatherData(cityName);
      });
    };

    const error = () => {
      this.view.notificationView.showNotification(
        "Could not get your location, please enter your city in the search bar."
      );
      this.initWeatherData("London");
    };

    const options = {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: 27000,
    };

    if (!navigator.geolocation) {
      error();
    } else {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  };

  updateCurrentCity = async (cityName: string): Promise<void> => {
    try {
      this.view.loadingView.showLoadingIndicator();
      const result = await this.updateWeather(cityName);
      this.view.graphView.updateGraph(result.hourlyWeatherArray);
      this.view.favouritesView.checkIfFavourite(
        this.model.isCityInFavourites(result.cityName)
      );
      this.model.setInitialCity(result.cityName);
    } catch (error) {
      if (error instanceof TypeError) {
        this.view.notificationView.showNotification(
          "Unknown or incorrect city name."
        );
      } else {
        this.view.notificationView.showNotification(error.message);
      }
    } finally {
      this.view.loadingView.hideLoadingIndicator();
    }
  };

  updateWeather = async (cityName: string): Promise<Weather> => {
    const result: Weather = await new Promise((resolve) => {
      resolve(this.getWeatherData(cityName));
    });
    this.model.setWeather(result);
    this.view.weatherView.displayCurrentWeather(result);
    this.view.weatherView.displayWeeklyWeather(result.weeklyWeatherArray);
    return result;
  };

  convertFavouriteCityToObject = async (
    cityName: string
  ): Promise<IFavouriteObject> => {
    const result = await this.getMinimalWeatherData(cityName);
    return {
      icon: result.icon,
      cityName: result.cityName,
      weatherDescription: result.description,
      temperature: result.temperature,
    };
  };

  getWeatherData = async (cityName: string): Promise<Weather> => {
    const { lat, lon } = await getCoordinates(cityName);
    const result = await fetchWeather(lat, lon);
    const weatherData = await WeatherFormatter.formatWeather(result, cityName);

    return weatherData;
  };

  getMinimalWeatherData = async (cityName: string): Promise<MinimalWeather> => {
    const { lat, lon } = await getCoordinates(cityName);
    const result = await fetchMinimalWeather(lat, lon);
    const minimalWeatherData = await WeatherFormatter.formatMinimalWeather(
      result,
      cityName
    );

    return minimalWeatherData;
  };
}
