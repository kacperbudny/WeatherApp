export default class SearchView {
  searchForm: HTMLFormElement;

  constructor() {
    this.searchForm = <HTMLFormElement>document.getElementById("search-form")!;
  }

  bindSearch = (handler: (inputValue: string) => void): void => {
    this.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = <HTMLInputElement>this.searchForm.elements[0];

      handler(input.value);

      input.value = "";
    });
  };
}
