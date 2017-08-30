import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css';
import RainData from './RainData/RainData';
import Map from './Map/Map';
import getTheme from './theme';

/*
  Controls which screen is displaying (map or rain data)
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewingData: false,
      location: {
        lat: 0,
        lng: 0,
      },
    };

    this.viewData = (location) => {
      this.setState(() => ({
        viewingData: true,
        location,
      }));
    };

    this.viewMap = () => {
      this.setState(() => ({
        viewingData: false,
      }));
    };
  }

  render() {
    const { viewingData } = this.state;
    let dataView = '';
    if (viewingData) {
      dataView = (
        <div className="Screen">
          <RainData
            returnToMap={this.viewMap}
            location={this.state.location}
          />
        </div>
      );
    }
    return (
      <MuiThemeProvider muiTheme={getTheme()}>
        <div className="App">
          <AppBar
            title="Rainfall Explorer"
            showMenuIconButton={false}
            iconElementRight={<IconButton><InfoOutline /></IconButton>}
          />
          <div className="Screen">
            <Map locationPicked={this.viewData} />
          </div>
          {dataView}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
