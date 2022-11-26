import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputElement = document.querySelector('input#search-box');
const countryInfoElement = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;
const filterFields = ['name', 'capital', 'population', 'flags', 'languages'];

let debounceCallback = debounce(inputEventCallback, DEBOUNCE_DELAY);
inputElement.addEventListener('input', debounceCallback);
function inputEventCallback() {
  countryInfoElement.innerHTML = '';
  countryList.innerHTML = '';

  let resultTrim = inputElement.value.trim();
  if (resultTrim !== '') {
    let result = fetchCountries(resultTrim, filterFields);
    result.then(countrySuccessCallback).catch(errorCallback);
  }
}

function countrySuccessCallback(arrayCountries) {
  if (arrayCountries.length === 1) {
    createMarkupCountry(arrayCountries[0]);
  }
  if (arrayCountries.length >= 2 && arrayCountries.length < 10) {
    createMarkupCountries(arrayCountries);
  }
  if (arrayCountries.length >= 10) {
    Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}
function errorCallback(error) {
  Notify.failure(error.message);
}

function createMarkupCountry(countryJson) {
  const countryLanguages = countryJson.languages.map(lenguagesCallback);
  countryInfoElement.innerHTML = `<h2 class="country-info__header"> <img src="${
    countryJson.flags.svg
  }" alt="${countryJson.name}" height="50">${countryJson.name}</h2>
      <div class="country-info__item"><b>Capital:</b> ${
        countryJson.capital
      }</div>
      <div class="country-info__item"><b>Population:</b> ${
        countryJson.population
      }</div>
      <div class="country-info__item"><b>Languages:</b> ${countryLanguages.join(
        ', '
      )}</div>
    </div>`;
}
function lenguagesCallback(currentValue) {
  return currentValue.name;
}

function createMarkupCountries(countriesArray) {
  let arrayHtmlElements = countriesArray.map(arrayCallback);
  countryList.innerHTML = arrayHtmlElements.join('');
}
function arrayCallback(currentCountryJson) {
  return `<li class="country-list__item"> <img src="${currentCountryJson.flags.svg}" alt="${currentCountryJson.name}" width="50">${currentCountryJson.name}</li>`;
}
