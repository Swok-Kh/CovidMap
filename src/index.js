import './scss/main.scss';
import { fetchCovidData } from './js/Helpers';

const test = async () => {
  const data = await fetchCovidData();
  data.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
  console.log(data.Countries);
};

test();
