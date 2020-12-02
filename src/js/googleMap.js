import mapStyle from './mapStyle.json';
import { GOOGLE_KEY, requestGeocode, requestGeocodeLatLng } from './Helpers';
import { info } from 'autoprefixer';

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
  async panTo(country) {
    this.isGeocodeInStaorage(country)
      ? this.panToCountry(JSON.parse(localStorage.getItem(country)))
      : this.panToCountry(await this.geocodeHandler(country, requestGeocode));
  }
  panToCountry(country) {
    this._map.setZoom(2);
    setTimeout(() => {
      this._map.panTo(country.geometry.location);
    }, 500);
    setTimeout(() => {
      this._map.setZoom(this.calculateZoom(country));
    }, 1000);
  }
  isGeocodeInStaorage(country) {
    if (
      localStorage.getItem(country) !== null ||
      localStorage.getItem(country) === 'undefined'
    ) {
      return true;
    } else {
      return false;
    }
  }
  async geocodeHandler(request, cb) {
    const { results } = await cb(request);
    for (let i = 0; i < results.length; i += 1) {
      if (
        (results[i].types.includes('country') &&
          results[i].types.includes('political')) ||
        (results[i].types.includes('locality') &&
          results[i].types.includes('political'))
      ) {
        return results[i];
      }
    }
    return;
  }
  drawCircles(countries) {
    this._maxCases = countries[0].TotalConfirmed;
    let delay = 0;
    for (let i = 0; i < countries.length; i++) {
      if (this.isGeocodeInStaorage(countries[i].Country)) {
        this.drawCircle(
          countries[i],
          JSON.parse(localStorage.getItem(countries[i].Country)).geometry
            .location,
        );
      } else {
        this.throttleGeocodeRequest(countries[i], delay);
        delay += 35;
      }
    }
  }
  throttleGeocodeRequest(countries, delay) {
    setTimeout(async () => {
      const res = await this.geocodeHandler(countries.Country, requestGeocode);
      localStorage.setItem(countries.Country, JSON.stringify(res));
      this.drawCircle(countries, res.geometry.location);
    }, delay);
  }
  drawCircle(country, position) {
    const color = this.calculateColor(country.TotalConfirmed);
    const casesCircle = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: this._map,
      center: position,
      radius: Math.sqrt(country.TotalConfirmed) * 400,
    });
    // casesCircle.addListener('click', e => {
    //   const infowindow = new google.maps.InfoWindow({
    //     content: country.TotalConfirmed.toString(),
    //     position,
    //   });

    //   infowindow.open(this.map, casesCircle);
    // });
  }
  calculateColor(value) {
    const x = Math.round((255 * value) / this._maxCases);
    if (x === 0) return `#b2ff00`;
    if (x <= 255) return `#ff${this.colorToHex(255 - x)}00`;
    if (x > 255) return '#ff0000';
  }
  colorToHex(num) {
    const x = num.toString(16);
    return x.length === 1 ? '0' + x : x;
  }
  calculateZoom(result) {
    const northeast = result.geometry.bounds.northeast;
    const southwest = result.geometry.bounds.southwest;
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
