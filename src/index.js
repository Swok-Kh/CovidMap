import './scss/main.scss';
import { GoogleMap } from './js/googleMap';
import { CountriesList } from './js/CountriesList';

const map = new GoogleMap({ mapId: 'map' });
const countryList = new CountriesList({ selector: '.main' });
countryList.bindMap(map);
