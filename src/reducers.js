import { combineReducers } from 'redux';
import map from './map/mapReducer';
import rainData from './rainData/rainDataReducer';

const weatherApp = combineReducers({
  map,
  rainData,
});

export default weatherApp;
