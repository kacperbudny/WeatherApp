import LoadingView from "./loadingView";
import WeatherView from "./weatherView";
import NotificationView from "./notificationView";
import SearchView from "./searchView";
import FavouritesView from "./favouritesView";
import GraphView from "./graphView";

export default class AppView {
  loadingView: LoadingView;
  weatherView: WeatherView;
  notificationView: NotificationView;
  searchView: SearchView;
  favouritesView: FavouritesView;
  graphView: GraphView;

  constructor() {
    this.loadingView = new LoadingView();
    this.weatherView = new WeatherView();
    this.notificationView = new NotificationView();
    this.searchView = new SearchView();
    this.favouritesView = new FavouritesView();
    this.graphView = new GraphView();
  }
}
