export default class LoadingView {
  loadingOverlay: HTMLElement;

  constructor() {
    this.loadingOverlay = document.getElementById("loading-overlay")!;
  }

  showLoadingIndicator = (): void => {
    this.loadingOverlay.style.display = "flex";
  };

  hideLoadingIndicator = (): void => {
    this.loadingOverlay.style.display = "none";
  };
}
