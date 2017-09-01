import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';

// Expose roboto font
require('typeface-roboto');

const loggerMiddleware = createLogger();

const middlewares = [];
middlewares.push(thunkMiddleware);
if (process.env.NODE_ENV === 'development') middlewares.push(loggerMiddleware);

const store = createStore(
  reducers,
  applyMiddleware(...middlewares),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'),
);
registerServiceWorker();
