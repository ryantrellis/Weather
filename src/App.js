import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css';
import RainData from './RainData/RainDataContainer';
import Map from './Map/Map';
import getTheme from './theme';
import InfoDialog from './Info/InfoDialog';

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
      infoOpen: true,
    };

    this.handleDataOpen = (location) => {
      this.setState({ viewingData: true, location });
    };

    this.handleDataClose = () => {
      this.setState({ viewingData: false });
    };

    this.handleInfoOpen = () => {
      this.setState({ infoOpen: true });
    };

    this.handleInfoClose = () => {
      this.setState({ infoOpen: false });
    };
  }

  render() {
    const { viewingData, infoOpen } = this.state;
    let dataView = '';
    if (viewingData) {
      dataView = (
        <div className="Screen">
          <RainData
            returnToMap={this.handleDataClose}
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
            iconElementRight={
              <IconButton onClick={this.handleInfoOpen}>
                <InfoOutline />
              </IconButton>
            }
          />
          <InfoDialog handleClose={this.handleInfoClose} open={infoOpen} />
          <div className="Screen">
            <Map locationPicked={this.handleDataOpen} />
          </div>
          {dataView}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
