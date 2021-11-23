import Weather from "../models/weather";
import WeeklyWeather from "../models/weeklyWeather";

export default class WeatherView {
  constructor() {
    const detailsHeader = document.getElementById("details-header")!;
    detailsHeader.addEventListener("click", this.collapseDetails);

    this.setNext7DaysOfWeek();
  }

  displayCurrentWeather = (weatherData: Weather): void => {
    const cityNameElement = document.getElementById("city-name")!;
    cityNameElement.innerText = weatherData.cityName;
    const temperatureElement = document.getElementById("current-temperature")!;
    temperatureElement.innerText = weatherData.temperature.toString();
    const descriptionElement = document.getElementById("current-description")!;
    descriptionElement.innerText = weatherData.description;
    const sensedTemperatureElement =
      document.getElementById("sensed-temperature")!;
    sensedTemperatureElement.innerText =
      weatherData.sensedTemperature.toString();
    const humidityElement = document.getElementById("humidity")!;
    humidityElement.innerText = weatherData.humidity.toString();
    const windElement = document.getElementById("wind")!;
    windElement.innerText = weatherData.wind.toString();
    const pressureElement = document.getElementById("pressure")!;
    pressureElement.innerText = weatherData.pressure.toString();
    const iconElement = <HTMLObjectElement>(
      document.getElementById("current-icon")!
    );
    iconElement.data = weatherData.icon;
    const uvElement = document.getElementById("uv")!;
    uvElement.innerText = weatherData.uv.toString();
  };

  displayWeeklyWeather = (weeklyData: WeeklyWeather[]): void => {
    const iconElements = <NodeListOf<HTMLObjectElement>>(
      document.querySelectorAll(".weather-icon")!
    );
    const descriptionElements = <NodeListOf<HTMLElement>>(
      document.querySelectorAll(".weather-description")
    );
    const maxTempElements = <NodeListOf<HTMLElement>>(
      document.querySelectorAll(".max-temp-data")
    );
    const minTempElements = <NodeListOf<HTMLElement>>(
      document.querySelectorAll(".min-temp-data")
    );

    for (let i = 0; i < 7; i++) {
      iconElements[i].data = weeklyData[i].icon;
      descriptionElements[i].innerText = weeklyData[i].description;
      maxTempElements[i].innerText = weeklyData[i].maxTemperature.toString();
      minTempElements[i].innerText = weeklyData[i].minTemperature.toString();
    }
  };

  collapseDetails = (event: Event): void => {
    const panel = <HTMLElement>(
      (<HTMLElement>event.currentTarget!).nextElementSibling!
    );
    panel.classList.toggle("active");

    if (!panel.style.maxHeight) {
      this.initDetailsContentsMaxWidth();
    }

    setTimeout(() => {
      if (!panel.classList.contains("active")) {
        panel.style.maxHeight = "0";
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  };

  initDetailsContentsMaxWidth = (): void => {
    const detailsContent = document.getElementById("details-content")!;
    detailsContent.style.maxHeight = detailsContent.scrollHeight + "px";
  };

  setNext7DaysOfWeek = (): void => {
    const dayElements = <NodeListOf<HTMLElement>>(
      document.querySelectorAll(".day")
    );
    const nextWeekdays = this.getNext7DaysOfWeek();

    dayElements.forEach((elem, index) => {
      elem.innerText = nextWeekdays[index];
    });
  };

  getNext7DaysOfWeek = (): string[] => {
    const weekdayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const arrayOfWeekdays = ["Tomorrow"];
    const date = new Date();
    date.setDate(date.getDate() + 1);

    for (let i = 0; i < 6; i++) {
      date.setDate(date.getDate() + 1);
      arrayOfWeekdays.push(weekdayNames[date.getDay()]);
    }

    return arrayOfWeekdays;
  };
}
