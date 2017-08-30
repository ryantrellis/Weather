import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import getTheme from './theme';

require('typeface-roboto');

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getTheme()}>
      <App />
    </MuiThemeProvider>
  </Provider>
  , document.getElementById('root'),
);
registerServiceWorker();
