export const GOOGLE_KEY = 'AIzaSyCt4W1fPSOmqULFw73S3-zkHycP0_5iG50';

export async function requestCovidData() {
  const data = await fetch('https://api.covid19api.com/summary');
  return data.json();
}

export async function requestGeocode(country) {
  const data = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${country}&key=${GOOGLE_KEY}`,
  );
  return data.json();
}
export async function requestGeocodeLatLng(latlng) {
  const data = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng.lat},${latlng.lng}&key=${GOOGLE_KEY}`,
  );
  return data.json();
}

// Getting max value and target value, and calculating color in HEX from orange to red.
// For zero value returning green color
export function calculateColor(targetValue, maxValue) {
  const x = Math.round((255 * targetValue) / maxValue);
  if (x === 0) return `#b2ff00`;
  if (x <= 255) return `#ff${colorToHex(255 - x)}00`;
  if (x > 255) return '#ff0000';
}
function colorToHex(num) {
  const x = num.toString(16);
  return x.length === 1 ? '0' + x : x;
}
