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
    type: RECEIVE_RAIN_DATA,
    coordinates,
    error,
  };
}

function fetchRainData(coordinates) {
  const { lat, lng } = coordinates;
  return (dispatch) => {
    dispatch(requestRainData(coordinates));
    return fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=4a9392bb837a99ef8b64347ed48199ee`)
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
        data.forecast = json.list.map(e => ({
          time: new Date(e.dt),
          rain: e.rain['3h'],
        }));
        return data;
      })
      .then(data => dispatch(receiveRainData(coordinates, data)))
      .catch((err) => {
        dispatch(errorRainData(coordinates, err));
      });
  };
}

function daysBetween(date1, date2) {
  const oneDay = 1000 * 60 * 60 * 24;
  const date1ms = date1.getTime();
  const date2ms = date2.getTime();
  const differenceMs = date2ms - date1ms;
  return Math.abs(Math.round(differenceMs / oneDay));
}

export function getCoordinateIndex(coordinates) {
  const { lat, lng } = coordinates;
  return lat.toString() + lng.toString();
}

function shouldfetchRainData(state, coordinates) {
  const rainData = state.rainData[getCoordinateIndex(coordinates)];
  if (rainData) {
    if (rainData.isFetching) {
      // We are already requesting the data, so don't start another request
      return false;
    }

    if (rainData.error) {
      // An error occured last time we fetched the data
      return false;
    }

    const now = Date.now();
    if (daysBetween(now, rainData.receivedAt) > 0) {
      // The data is too old, so request the data again
      return false;
    }
  }
  return true;
}

export default function fetchRainDataIfNeeded(coordinates) {
  return (dispatch, getState) => {
    if (shouldfetchRainData(getState(), coordinates)) {
      return dispatch(fetchRainData(coordinates));
    } else {
      return Promise.resolve();
    }
  };
}
