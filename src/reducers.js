import { combineReducers } from 'redux';

import rainData from './RainData/RainDataReducer';

const weatherApp = combineReducers({
  rainData,
});

export default weatherApp;
