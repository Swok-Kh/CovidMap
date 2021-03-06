import './scss/main.scss';
import { GoogleMap } from './js/googleMap';
import { CountriesList } from './js/CountriesList';

const map = new GoogleMap({ mapId: 'map' });
const countryList = new CountriesList({
  selector: '.countries-list-wrapper',
  extInfoSelector: '.extended-info-wrapper',
});
countryList.bindMap(map);
