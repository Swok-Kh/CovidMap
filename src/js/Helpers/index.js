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
