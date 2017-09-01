import {
  REQUEST_RAIN_DATA,
  RECEIVE_RAIN_DATA,
  ERROR_RAIN_DATA,
  getCoordinateIndex,
} from './RainDataActions';

/*
SCHEMA

rainData: {
  latlng: {
    isFetching: bool,
    recievedAt: Date,
    data: {
      city: string,
      dailyData: {
        YYYYMMDD: Number,
      },
    },
    error: string
  }
}
*/

const rainDataReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_RAIN_DATA: {
      return Object.assign({}, state, {
        [getCoordinateIndex(action.coordinates)]: {
          isFetching: true,
        },
      });
    }

    case RECEIVE_RAIN_DATA: {
      return Object.assign({}, state, {
        [getCoordinateIndex(action.coordinates)]: {
          isFetching: false,
          receivedAt: action.receivedAt,
          data: action.data,
        },
      });
    }

    case ERROR_RAIN_DATA: {
      return Object.assign({}, state, {
        [getCoordinateIndex(action.coordinates)]: {
          isFetching: false,
          error: action.error,
        },
      });
    }

    default: {
      return state;
    }
  }
};

export default rainDataReducer;
