import { CategoryScale, ChartOptions } from "chart.js";
import { ChartData } from "chart.js";
import Chart, { ChartItem } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import HourlyWeather from "../models/hourlyWeather";

export default class GraphView {
  graph!: Chart;
  dataArray: HourlyWeather[];

  constructor() {
    this.dataArray = [];
  }

  displayGraph = (hourlyWeatherArray: HourlyWeather[]): void => {
    const labels = this.getNext24HoursLabels();
    const { temperature, maxY, minY } = this.getGraphData(hourlyWeatherArray);

    this.setUpGraph(labels, temperature, maxY, minY);
  };

  updateGraph = (hourlyWeatherArray: HourlyWeather[]): void => {
    const { temperature, maxY, minY } = this.getGraphData(hourlyWeatherArray);

    this.graph.data.datasets[0].data = temperature;
    this.graph.options.scales!.y!.max = maxY;
    this.graph.options.scales!.y!.min = minY;
    this.graph.update();
  };

  setUpGraph = (
    labels: string[],
    temperature: number[],
    maxY: number,
    minY: number
  ): void => {
    Chart.register(ChartDataLabels);
    Chart.defaults.font.size = 14;
    Chart.defaults.font.family = `"Ubuntu", sans-serif`;

    const ctx = <ChartItem>document.getElementById("hourly-graph")!;
    this.graph = new Chart(ctx, {
      type: "line",
      data: this.setUpGraphData(labels, temperature),
      plugins: [ChartDataLabels],
      options: this.setUpGraphOptions(minY, maxY),
    });
  };

  getGraphData = (
    hourlyWeatherArray: HourlyWeather[]
  ): { temperature: number[]; maxY: number; minY: number } => {
    this.dataArray = hourlyWeatherArray;
    const temperature = hourlyWeatherArray.map(
      (weatherData) => weatherData.temperature
    );
    const maxY = Math.max.apply(null, temperature) + 2;
    const minY = Math.min.apply(null, temperature) - 2;

    return { temperature, maxY, minY };
  };

  getNext24HoursLabels = (): string[] => {
    const array = [];

    const now = new Date();
    let hours = now.getHours();

    for (let i = 0; i < 24; i++) {
      array.push(hours + ":00");
      hours++;
      if (hours >= 24) {
        hours = 0;
      }
    }

    return array;
  };

  setUpGraphData = (labels: string[], temperature: number[]): ChartData => {
    return {
      labels: labels,
      datasets: [
        {
          label: "Temperature",
          data: temperature,
          fill: {
            target: "origin",
            above: "rgba(255,170,99,0.5)",
            below: "rgba(255,170,99,0.5)",
          },
          borderColor: "rgba(255,170,99,1)",

          tension: 0.2,
        },
      ],
    };
  };

  setUpGraphOptions = (minY: number, maxY: number): ChartOptions => {
    const dataArray = this.dataArray;

    return {
      interaction: {
        intersect: false,
        mode: "nearest",
      },
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          displayColors: false,
          footerFont: {
            size: 14,
          },
          callbacks: {
            title: function (tooltipItems) {
              const date = new Date(
                dataArray[tooltipItems[0].parsed.x].date * 1000
              );

              return `${date.getDate()}.${
                date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1)
                  : date.getMonth() + 1
              }.${date.getFullYear()} ${
                date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
              }:${
                date.getMinutes() < 10
                  ? "0" + date.getMinutes()
                  : date.getMinutes()
              }`;
            },
            label: function (tooltipItem) {
              return `Temperature: ${tooltipItem.parsed.y.toFixed(
                1
              )} ${String.fromCharCode(176)}C`;
            },
            afterLabel: function (tooltipItem) {
              return `Humidity: ${dataArray[tooltipItem.parsed.x].humidity}%`;
            },
            afterBody: function (tooltipItems) {
              return `Wind: ${dataArray[tooltipItems[0].parsed.x].wind} km/h`;
            },
            footer: function (tooltipItems) {
              return `${dataArray[tooltipItems[0].parsed.x].description}`;
            },
          },
        },
        datalabels: {
          color: "white",
          anchor: "end",
          align: "top",
          clamp: true,
          offset: 0,
          display: function (context) {
            return context.dataIndex % 3 === 1;
          },
          formatter: function (value) {
            return Math.round(value);
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderColor: "white",
          },
          ticks: {
            callback: function (val, index) {
              return index % 3 === 1
                ? (<CategoryScale>this).getLabelForValue(+val)
                : "";
            },
            color: "white",
            maxRotation: 0,
            autoSkipPadding: -10,
          },
        },
        y: {
          max: maxY,
          min: minY,
          grid: {
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderColor: "white",
          },
          ticks: {
            display: false,
            color: "white",
          },
        },
      },
    };
  };
}
