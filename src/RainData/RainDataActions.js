import moment from 'moment';
import { mergeWith } from 'lodash';

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

/* Schema for return result
{
  month: {
    day: Number
  }
} */

function mergePrecip(a, b) {
  if (a === undefined) {
    return b;
  }
  return a + b;
}

function fetchForecast(coordinates) {
  const { lat, lng } = coordinates;
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
      data.city = `${json.city.name}, ${json.city.country}`;
      let o = {};
      json.list.forEach((e) => {
        const date = moment(e.dt * 1000);
        const precip = e.rain['3h'] || 0;
        // mergeWith adds the values if we already had some rain on the day
        o = mergeWith(o, { [date.format('YYYYMMDD')]: precip }, mergePrecip);
      });
      data.hourlyData = o;
      return data;
    });
}

function fetchHistory(coordinates) {
  const { lat, lng } = coordinates;
  const startDate = moment().add(-30, 'days');
  const endDate = moment();
  const sd = startDate.format('YYYY-MM-DD');
  const ed = endDate.format('YYYY-MM-DD');
  const url = `https://api.worldweatheronline.com/premium/v1/past-weather.ashx?q=${lat},${lng}&date=${sd}&enddate=${ed}&key=7726106ec24145b790701202173108`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(response => response.text())
    .then(response => (new window.DOMParser()).parseFromString(response, 'text/xml'))
    .then((xml) => {
      const days = [...xml.getElementsByTagName('weather')];

      function nodeValue(node) {
        return node.childNodes[0].nodeValue;
      }

      // The object that will hold the parsed data
      let o = {};
      days.forEach((dayElem) => {
        const date = moment(nodeValue(dayElem.getElementsByTagName('date')[0]));
        const hourElems = [...dayElem.getElementsByTagName('hourly')];
        hourElems.forEach((hourElem) => {
          const precip = Number(nodeValue(hourElem.getElementsByTagName('precipMM')[0]));
          // mergeWith adds the values if we already had some rain on the day
          o = mergeWith(o, { [date.format('YYYYMMDD')]: precip }, mergePrecip);
        });
      });
      return { hourlyData: o };
    });
}

function fetchRainData(coordinates) {
  return (dispatch) => {
    dispatch(requestRainData(coordinates));
    Promise.all([fetchForecast(coordinates), fetchHistory(coordinates)])
      .then(([forecast, history]) =>
        dispatch(receiveRainData(coordinates, {
          city: forecast.city,
          hourlyData: mergeWith(forecast.hourlyData, history.hourlyData, mergePrecip),
        })))
      .catch(err => dispatch(errorRainData(coordinates, err)));
  };
}

function hoursBetween(date1, date2) {
  const oneHour = 1000 * 60 * 60;
  const differenceMs = date2 - date1;
  return Math.abs(Math.round(differenceMs / oneHour));
}

export function getCoordinateIndex(coordinates) {
  // Used to access data for a coordinate pair
  const { lat, lng } = coordinates;
  return lat.toString() + lng.toString();
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

    if (hoursBetween(Date.now(), rainData.receivedAt) > 0) {
      // The data is too old, so request the data again
      return true;
    }
    return false;
  } else {
    // We have no data for this point so fetch some
    return true;
  }
}

export default function fetchRainDataIfNeeded(coordinates) {
  return (dispatch, getState) => {
    if (shouldFetchRainData(getState(), coordinates)) {
      return dispatch(fetchRainData(coordinates));
    } else {
      return Promise.resolve();
    }
  };
}
