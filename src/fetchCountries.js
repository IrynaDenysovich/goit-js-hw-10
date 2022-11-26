export default function fetchCountries(name, fields) {
  let fetchResult = fetch(
    `https://restcountries.com/v2/name/${name}/?fields=${fields.join(',')}`
  );
  return fetchResult.then(fetchCallback);
}

function fetchCallback(resp) {
  if (!resp.ok) {
    throw new Error('Oops, there is no country with that name');
  }
  return resp.json();
}
