import { IFavouriteObject } from "../interfaces/favouriteObject";

export default class FavouritesView {
  heartButton: HTMLElement;
  favouritesList: HTMLElement;
  closeFavouritesButton: HTMLElement;
  darkOverlay: HTMLElement;
  openFavouritesButton: HTMLElement;
  onDeleteFavouriteCity!: (cityName: string) => void;

  constructor() {
    this.heartButton = document.getElementById("heart-button")!;
    this.favouritesList = document.getElementById("favourites-list")!;

    this.closeFavouritesButton = document.getElementById("close-favourites")!;
    this.closeFavouritesButton.onclick = this.closeFavouritesList;

    this.darkOverlay = document.getElementById("dark-overlay")!;
    this.darkOverlay.onclick = this.closeFavouritesList;

    this.openFavouritesButton = document.getElementById(
      "open-favourites-button"
    )!;
    this.openFavouritesButton.onclick = this.openFavouritesList;
  }

  bindClickFavouriteCity = (handler: (inputValue: string) => void): void => {
    this.favouritesList.addEventListener("click", (event) => {
      const item = (<HTMLElement>event.target).closest(".favourite-item");
      if (!item) return;
      if (!this.favouritesList.contains(item)) return;
      if (event.defaultPrevented) return;

      handler(item.querySelector("h4")!.innerText);
      this.closeFavouritesList();
    });
  };

  bindDeleteFavouriteCity = (callback: (cityName: string) => void): void => {
    this.onDeleteFavouriteCity = callback;
  };

  bindToggleHeartButton = (handler: () => void): void => {
    this.heartButton.addEventListener("click", () => {
      try {
        handler();
        this.swapFavouriteIcons();
      } catch {
        //
      }
    });
  };

  swapFavouriteIcons = (): void => {
    const heartButton = document.getElementById("heart-button")!;
    const emptyHeart = heartButton.firstElementChild!;
    const fullHeart = heartButton.lastElementChild!;

    heartButton.classList.toggle("active");
    emptyHeart.classList.toggle("visible");
    emptyHeart.classList.toggle("hidden");
    fullHeart.classList.toggle("visible");
    fullHeart.classList.toggle("hidden");
  };

  checkIfFavourite = (isInFavourites: boolean): void => {
    if (
      (isInFavourites &&
        !document
          .getElementById("heart-button")!
          .classList.contains("active")) ||
      (!isInFavourites &&
        document.getElementById("heart-button")!.classList.contains("active"))
    ) {
      this.swapFavouriteIcons();
    }
  };

  displayFavourites = (favourites: IFavouriteObject[]): void => {
    while (this.favouritesList.firstChild) {
      this.favouritesList.removeChild(this.favouritesList.firstChild);
    }

    if (favourites.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Your list of favourites is empty.";
      this.favouritesList.append(p);
    } else {
      favourites.forEach((favourite) => this.createNewFavouriteItem(favourite));
    }
  };

  createNewFavouriteItem = ({
    icon,
    cityName,
    temperature,
    weatherDescription,
  }: IFavouriteObject): void => {
    const favouritesList = document.getElementById("favourites-list")!;
    const template = <HTMLTemplateElement>(
      document.getElementById("favourite-item-template")!
    );

    const clone = <HTMLElement>template.content.cloneNode(true);
    const cityElement = clone.querySelector("h4")!;
    cityElement.innerText = cityName;
    const temperatureElement = <HTMLSpanElement>(
      clone.querySelector(".temperature")!
    );
    temperatureElement.innerText = temperature.toString();
    const descriptionElement = <HTMLParagraphElement>(
      clone.querySelector(".description")!
    );
    descriptionElement.innerText = weatherDescription;
    const iconElement = <HTMLObjectElement>clone.querySelector(".icon")!;
    iconElement.data = icon;
    const removeButton = clone.querySelector(".remove-button")!;

    removeButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.onDeleteFavouriteCity(cityName);
    });

    favouritesList.appendChild(clone);
  };

  openFavouritesList = (): void => {
    const overlay = document.getElementById("dark-overlay")!;
    const favouritesContainer = document.getElementById(
      "favourites-container"
    )!;
    overlay.hidden = false;
    favouritesContainer.hidden = false;

    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = "fixed";

    setTimeout(() => {
      overlay.style.opacity = "1.0";
      favouritesContainer.style.right = "0px";
    }, 0);
  };

  closeFavouritesList = (): void => {
    const overlay = document.getElementById("dark-overlay")!;
    const favouritesContainer = document.getElementById(
      "favourites-container"
    )!;
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);

    setTimeout(() => {
      favouritesContainer.style.right = "calc(-100% - 100px)";
      overlay.style.opacity = "0.0";
    }, 0);

    setTimeout(() => {
      overlay.hidden = true;
      favouritesContainer.hidden = true;
    }, 500);
  };
}
