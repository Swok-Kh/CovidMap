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
  async panToCountry(country) {
    const response = await this.geocodeHandler(country);
    this._map.setZoom(2);
    setTimeout(() => {
      this._map.panTo(response.geometry.location);
    }, 500);
    setTimeout(() => {
      this._map.setZoom(this.countZoom(response));
    }, 1000);
  }
  async geocodeHandler(country) {
    const { results } = await requestGeocode(country);
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
    let timerCount = 0;
    for (let i = 0; i < countries.length; i++) {
      if (localStorage.getItem(countries[i].Country) !== null) {
        this.drawCircle(
          countries[i],
          JSON.parse(localStorage.getItem(countries[i].Country)).geometry
            .location,
        );
      } else {
        setTimeout(async () => {
          const res = await this.geocodeHandler(countries[i].Country);
          localStorage.setItem(countries[i].Country, JSON.stringify(res));
          this.drawCircle(countries[i], res.geometry.location);
        }, timerCount);
        timerCount += 35;
      }
    }
  }
  drawCircle(country, position) {
    const casesCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this._map,
      center: position,
      radius: Math.sqrt(country.TotalConfirmed) * 200,
    });
  }
  countZoom(result) {
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
