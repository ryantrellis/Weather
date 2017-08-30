import { combineReducers } from 'redux';

import map from './Map/MapReducer';
import rainData from './RainData/RainDataReducer';

const weatherApp = combineReducers({
  map,
  rainData,
});

export default weatherApp;
