import countryListTemplate from '../templates/listOfCountries.hbs';
import { requestCovidData, requestGeocode } from './Helpers';
import countries from './countries.json';

export class CountriesList {
  constructor({ selector }) {
    this.listRef = document.querySelector(selector);
    this._list = { ...countries };
    this.init();
  }
  init() {
    this.responseDataHandler();
    this.listRef.addEventListener('click', this.clickHandler.bind(this));
  }
  async responseDataHandler() {
    const response = await requestCovidData();
    this.drawContent(response.Countries);
    this.updateTotalCases(response.Countries);
    this.dataFill(response.Countries);
  }
  updateTotalCases(data) {
    for (let index = 0; index < data.length; index += 1) {
      if (this._list.hasOwnProperty(`${data[index].Country}`)) {
        this._list[data[index].Country].cases = data[index].TotalConfirmed;
      }
    }
    this._map.drawCircles(this._list);
  }
  drawContent(data) {
    this.listRef.innerHTML = countryListTemplate(
      [...data].sort((a, b) => b.TotalConfirmed - a.TotalConfirmed),
    );
  }
  chooseCountry(target) {
    if (target.dataset.hasOwnProperty('country')) {
      return target.dataset.country;
    }
    return this.chooseCountry(target.parentNode);
  }
  bindMap(map) {
    this._map = map;
  }
  clickHandler(e) {
    this._map.panToCountry({
      country: this.chooseCountry(e.target),
      countryList: this._list,
    });
  }
  dataFill(list) {
    const temp = {};
    for (let index = 0; index < list.length; index++) {
      setTimeout(async () => {
        const result = await requestGeocode(list[index].Country);
        if (result.results.length === 1) {
          temp[list[index].Country] = {
            center: result.results[0].geometry.location,
            bounds: result.results[0].geometry.bounds,
          };
        } else {
          console.log(result.results);
        }
      }, 20 * index);
    }
    console.log();
  }
}
