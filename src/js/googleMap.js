import mapStyle from './mapStyle.json';
import { GOOGLE_KEY, requestGeocode } from './Helpers';

export class GoogleMap {
  constructor({ mapId }) {
    this._mapId = mapId;
    this.scriptInit();
  }
  init() {
    this._map = new google.maps.Map(document.getElementById(this._mapId), {
      center: { lat: 0, lng: 0 },
      zoom: 4,
      styles: mapStyle,
    });
  }
  scriptInit() {
    this._script = document.createElement('script');
    this._script.defer = true;
    this._script.async = true;
    this._script.type = 'text/javascript';
    this._script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}`;
    document.head.append(this._script);
    this._script.onload = () => this.init();
  }
  panToCountry({ country, countryList }) {
    this._map.setZoom(2);
    setTimeout(() => {
      this._map.panTo(countryList[country].center);
    }, 500);
    setTimeout(async () => {
      this._map.setZoom(this.countZoom(await requestGeocode(country)));
    }, 1000);
  }
  drawCircles(countries) {
    for (const country in countries) {
      this.drawCircle(countries[country]);
    }
  }
  drawCircle(country) {
    const casesCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this._map,
      center: country.center,
      radius: Math.sqrt(country.cases) * 200,
    });
  }
  countZoom({ results }) {
    const northeast = results[0].geometry.bounds.northeast;
    const southwest = results[0].geometry.bounds.southwest;
    const temp = Math.sqrt(
      Math.pow(northeast.lat - southwest.lat, 2) +
        Math.pow(northeast.lng - southwest.lng, 2),
    );
    if (temp < 10) {
      return 6;
    } else if (temp < 20) {
      return 5;
    } else if (temp < 100) {
      return 4;
    } else return 3;
  }
}
