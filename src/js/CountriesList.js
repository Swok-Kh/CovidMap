import countryListTemplate from '../templates/listOfCountries.hbs';
import extendedInfoTemplate from '../templates/extendedInfo.hbs';
import { requestCovidData, calculateColor } from './Helpers';

export class CountriesList {
  constructor({ selector, extInfoSelector }) {
    this.listRef = document.querySelector(selector);
    this.extInfoRef = document.querySelector(extInfoSelector);
    this.init();
  }
  init() {
    this.responseDataHandler();
    this.listRef.addEventListener('click', this.clickHandler.bind(this));
  }
  async responseDataHandler() {
    const { Countries } = await requestCovidData();
    this._countries = this.normalizeData(Countries);
    this.drawContent();
  }
  normalizeData(data) {
    return [...data]
      .sort((a, b) => b.TotalConfirmed - a.TotalConfirmed)
      .map((item, i, array) => {
        if (item.Country === 'Georgia') item.Country = 'Georgia country';
        if (item.Country === 'Togo') item.Country = 'Togolese Republic';
        if (item.Country === 'Tanzania, United Republic of')
          item.Country = 'United Republic of Tanzania';
        if (item.Country === 'Jordan')
          item.Country = 'Hashemite Kingdom of Jordan';
        item.color = calculateColor(
          item.TotalConfirmed,
          array[0].TotalConfirmed,
        );
        return item;
      });
  }
  drawContent() {
    this.listRef.innerHTML = countryListTemplate(this._countries);
    this._map.drawCircles(this._countries);
    this.drawExtInfo(this._countries[0]);
    this._map.panTo(this._countries[0].Country);
  }
  drawExtInfo(country) {
    this.extInfoRef.innerHTML = extendedInfoTemplate(country);
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
    const country = this.chooseCountry(e.target);
    this.drawExtInfo(this._countries.find(item => item.Country === country));
    this._map.panTo(country);
  }
}
