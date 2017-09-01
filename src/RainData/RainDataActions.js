import moment from 'moment';
import { mergeWith, padStart } from 'lodash';

export const REQUEST_RAIN_DATA = 'REQUEST_RAIN_DATA';
function requestRainData(coordinates) {
  return {
    type: REQUEST_RAIN_DATA,
    coordinates,
  };
}

export const RECEIVE_RAIN_DATA = 'RECEIVE_RAIN_DATA';
function receiveRainData(coordinates, data) {
  return {
    type: RECEIVE_RAIN_DATA,
    coordinates,
    data,
    receivedAt: Date.now(),
  };
}

export const ERROR_RAIN_DATA = 'ERROR_RAIN_DATA';
function errorRainData(coordinates, error) {
  return {
    type: ERROR_RAIN_DATA,
    coordinates,
    error,
  };
}

/*
Data comes in in an hourly format, but we only want to display
daily data.  Each data point is merged into an object which will
ultimately contain the daily rainfall sum.  If there is no data yet
for a value's day, it initializes that day.  If there is already
data, it adds to that sum.
The function is used by lodash's mergeWith.
*/
function mergePrecip(sum, val) {
  if (sum === undefined) {
    return val;
  }
  return sum + val;
}

function fetchForecast(coordinates) {
  const { lat, lng } = coordinates;
  // eslint-disable-next-line max-len
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=4a9392bb837a99ef8b64347ed48199ee`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(response => response.json())
    .then((json) => {
      const data = {};

      // Build city name if location has one
      data.city = '';
      if (json.city.name) {
        data.city += json.city.name;
      }
      if (json.city.country) {
        if (json.city) {
          data.city += `, ${json.city.country}`;
        } else {
          data.city = json.city.country;
        }
      }

      // The object that will hold the parsed data
      let o = {};

      json.list.forEach((e) => {
        if (!e.rain) return;
        const date = moment(e.dt * 1000);
        const precip = e.rain['3h'] || 0;
        // mergeWith sums the daily values
        o = mergeWith(o, { [date.format('YYYYMMDD')]: precip }, mergePrecip);
      });
      data.dailyData = o;
      return data;
    });
}

function fetchHistory(coordinates) {
  const { lat, lng } = coordinates;

  // Create the range to use in the query
  const startDate = moment().add(-30, 'days');
  const endDate = moment();
  const sd = startDate.format('YYYY-MM-DD');
  const ed = endDate.format('YYYY-MM-DD');

  // eslint-disable-next-line max-len
  const url = `https://api.worldweatheronline.com/premium/v1/past-weather.ashx?q=${lat},${lng}&date=${sd}&enddate=${ed}&key=7726106ec24145b790701202173108`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(response => response.text())
    .then(response => (new DOMParser()).parseFromString(response, 'text/xml'))
    .then((xml) => {
      function getFirstValueByTag(elem, tag) {
        return elem.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
      }

      // The object that will hold the parsed data
      let o = {};

      const days = [...xml.getElementsByTagName('weather')];
      days.forEach((dayElem) => {
        const date = moment(getFirstValueByTag(dayElem, 'date'));
        const hourElems = [...dayElem.getElementsByTagName('hourly')];
        hourElems.forEach((hourElem) => {
          const precip = Number(getFirstValueByTag(hourElem, 'precipMM'));
          // mergeWith sums the daily values
          o = mergeWith(o, { [date.format('YYYYMMDD')]: precip }, mergePrecip);
        });
      });
      return { dailyData: o };
    });
}

function fetchRainData(coordinates) {
  return (dispatch) => {
    dispatch(requestRainData(coordinates));
    return Promise.all([fetchForecast(coordinates), fetchHistory(coordinates)])
      .then(([forecast, history]) =>
        dispatch(receiveRainData(coordinates, {
          city: forecast.city,
          dailyData: mergeWith(forecast.dailyData, history.dailyData,
            mergePrecip),
        })))
      .catch(err => dispatch(errorRainData(coordinates, err)));
  };
}

export function getCoordinateIndex(coordinates) {
  // Used to access data for a coordinate pair
  // Google maps clamps all values to the legal range
  let { lat } = coordinates;
  const { lng } = coordinates;

  // Latitude is -90 -> 90, so make positive
  lat += 90;

  // Both are now 0 -> 180
  // Make sure both are in xxx.xx format
  function fc(x) {
    const pad = 2;
    return padStart(x.toFixed(pad), pad + 4, '0');
  }
  const index = fc(lat) + fc(lng);
  return index;
}

function shouldFetchRainData(state, coordinates) {
  const rainData = state.rainData[getCoordinateIndex(coordinates)];
  if (rainData) {
    if (rainData.isFetching) {
      // We are already requesting the data, so don't start another request
      return false;
    }

    if (rainData.error) {
      // An error occured last time we fetched the data
      return true;
    }

    const now = moment();
    const then = moment(rainData.receivedAt);
    if (now.diff(then, 'hours') > 1) {
      // The data is too old, so request the data again
      return true;
    }
    return false;
  } else {
    // We have no data for this point so fetch some
    return true;
  }
}

// Returns cached data if we have it, otherwise sends query
export default function fetchRainDataIfNeeded(coordinates) {
  return (dispatch, getState) => {
    if (shouldFetchRainData(getState(), coordinates)) {
      return dispatch(fetchRainData(coordinates));
    } else {
      return Promise.resolve();
    }
  };
}
