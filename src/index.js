import './scss/main.scss';
import countryListTemplate from './templates/listOfCountries.hbs';
import { requestCovidData } from './js/Helpers';

const countryListRef = document.querySelector('.main');
const mapRef = document.querySelector('.map');

const test = async () => {
  const data = await requestCovidData();

  countryListRef.innerHTML = countryListTemplate(
    [...data.Countries].sort((a, b) => b.TotalConfirmed - a.TotalConfirmed),
  );
  console.log(data.Countries);
};

const chooseCountry = target => {
  if (target.dataset.hasOwnProperty('country')) {
    return target.dataset.country;
  }
  return chooseCountry(target.parentNode);
};
const mapTest = country => {
  mapRef.innerHTML = country;
};
const clickHandler = e => {
  mapTest(chooseCountry(e.target));
};

countryListRef.addEventListener('click', clickHandler);

test();
