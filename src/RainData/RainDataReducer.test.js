import red from './RainDataReducer';
import {
  REQUEST_RAIN_DATA,
  RECEIVE_RAIN_DATA,
  ERROR_RAIN_DATA,
  getCoordinateIndex,
} from './RainDataActions';

const coordinates = {
  lat: 20,
  lng: 20,
};

describe('Rain Reducer', () => {
  it('should return the initial state', () => {
    expect(red(undefined, {})).toEqual({});
  });

  it('should handle REQUEST_RAIN_DATA', () => {
    expect(red(
      // Intial State
      {},
      // Action
      {
        type: REQUEST_RAIN_DATA,
        coordinates,
      }))
      .toEqual(
        // Result State
        {
          [getCoordinateIndex(coordinates)]: {
            isFetching: true,
          },
        });
  });

  it('should handle RECEIVE_RAIN_DATA', () => {
    const data = 1;
    const receivedAt = Date.now();
    expect(red(
      // Initial State
      {
        [getCoordinateIndex(coordinates)]: {
          isFetching: true,
        },
      },
      // Action
      {
        type: RECEIVE_RAIN_DATA,
        coordinates,
        data,
        receivedAt,
      }))
      .toEqual(
        // Result State
        {
          [getCoordinateIndex(coordinates)]: {
            isFetching: false,
            data,
            receivedAt,
          },
        });
  });

  it('should handle ERROR_RAIN_DATA', () => {
    const error = 'A terrible error';
    expect(red(
      // Initial State
      {
        [getCoordinateIndex(coordinates)]: {
          isFetching: true,
        },
      },
      // Action
      {
        type: ERROR_RAIN_DATA,
        coordinates,
        error,
      }))
      .toEqual(
        // Result State
        {
          [getCoordinateIndex(coordinates)]: {
            isFetching: false,
            error,
          },
        });
  });
});
