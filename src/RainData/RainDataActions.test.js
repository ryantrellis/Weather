import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchRainDataIfNeeded, {
  getCoordinateIndex,
  REQUEST_RAIN_DATA,
  RECEIVE_RAIN_DATA,
  ERROR_RAIN_DATA,
} from './RainDataActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const fs = require('fs');
const path = require('path');

const mockResponse = (status, statusText, response, contentType) =>
  new window.Response(response, {
    status,
    statusText,
    headers: {
      'Content-type': contentType,
    },
  });

function fakeOpenWeatherMapResponse() {
  return Promise.resolve(mockResponse(
    200,
    null,
    fs.readFileSync(
      path.join(__dirname, 'testApiResponses', 'openweathermap.json'),
    ),
    'application/json'));
}

function fakeWorldWideWeatherResponse() {
  return Promise.resolve(mockResponse(
    200,
    null,
    fs.readFileSync(
      path.join(__dirname, 'testApiResponses', 'worldweatheronline.xml'),
    ),
    'text/xml; charset=utf-8'));
}

function fakeFailedResponse() {
  return Promise.resolve(mockResponse(
    400,
    null,
    null,
    'application/json',
  ));
}

describe('RainData actions', () => {
  describe('Synchronous', () => {
    describe('get coordinate index', () => {
      it('should work with an easy case', () => {
        expect(getCoordinateIndex({ lat: 12.34, lng: 56.78 }))
          .toEqual('102.34236.78');
      });
      it('should force 2 decimal places for the coordinates', () => {
        expect(getCoordinateIndex({ lat: 10, lng: 100 }))
          .toEqual('100.00280.00');
      });
      it('should pad the coordinates', () => {
        expect(getCoordinateIndex({ lat: -90, lng: -180 }))
          .toEqual('000.00000.00');
      });
    });
  });

  describe('Asynchronous', () => {
    const oldFetch = window.fetch;
    beforeEach(() => {
      window.fetch = jest.fn().mockImplementation((url) => {
        const firstLetter = url.substring(12, 13);
        if (firstLetter === 'o') {
          return fakeOpenWeatherMapResponse();
        } else {
          return fakeWorldWideWeatherResponse();
        }
      });
    });

    afterEach(() => {
      window.fetch = oldFetch;
    });

    describe('fetchRainDataIfNeeded', () => {
      // Index of coordinates is 000.00000.00
      const coordinates = { lat: -90, lng: -180 };

      it('should not fetch if already fetching', () => {
        const store = mockStore({ rainData: {
          '000.00000.00': {
            isFetching: true,
          },
        } });

        return store.dispatch(fetchRainDataIfNeeded(coordinates))
          .then(() => {
            expect(store.getActions()).toEqual([]);
          });
      });

      it('should not fetch if already have recent data', () => {
        const now = Date.now();
        const store = mockStore({ rainData: {
          '000.00000.00': {
            isFetching: false,
            data: {},
            receivedAt: now,
            coordinates,
          },
        } });

        return store.dispatch(fetchRainDataIfNeeded(coordinates))
          .then(() => {
            expect(store.getActions()).toEqual([]);
          });
      });

      it('should fetch if we dont have data for the point', () => {
        const store = mockStore({ rainData: {
        } });
        return store.dispatch(fetchRainDataIfNeeded(coordinates))
          .then(() => {
            const actions = store.getActions();
            expect(actions.length).toEqual(2);
            expect(actions[0].type).toEqual(REQUEST_RAIN_DATA);
            expect(actions[1].type).toEqual(RECEIVE_RAIN_DATA);
          });
      });

      it('should fetch if we have expired data for the point', () => {
        const store = mockStore({ rainData: {
          '000.00000.00': {
            isFetching: false,
            data: {},
            receivedAt: 0,
            coordinates,
          },
        } });
        return store.dispatch(fetchRainDataIfNeeded(coordinates))
          .then(() => {
            const actions = store.getActions();
            expect(actions.length).toEqual(2);
            expect(actions[0].type).toEqual(REQUEST_RAIN_DATA);
            expect(actions[1].type).toEqual(RECEIVE_RAIN_DATA);
          });
      });

      it('should cause an ERROR_RAIN_DATA if the requests fail', () => {
        window.fetch = jest.fn().mockImplementation(() => fakeFailedResponse());
        const store = mockStore({ rainData: {
          '000.00000.00': {
            isFetching: false,
            data: {},
            receivedAt: 0,
            coordinates,
          },
        } });
        return store.dispatch(fetchRainDataIfNeeded(coordinates))
          .then(() => {
            const actions = store.getActions();
            expect(actions.length).toEqual(2);
            expect(actions[0].type).toEqual(REQUEST_RAIN_DATA);
            expect(actions[1].type).toEqual(ERROR_RAIN_DATA);
          });
      });
    });
  });
});
