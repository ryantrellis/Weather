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
        lat: NaN,
        lng: NaN,
      },
      mapCenter: {
        lat: 33.7490,
        lng: -84.3880,
      },
      infoOpen: false,
    };

    this.handleDataOpen = (location) => {
      history.replaceState(
        null,
        null,
        `#${location.lat.toFixed(2)},${location.lng.toFixed(2)}`);
      this.setState({
        viewingData: true,
        location,
        mapCenter: location,
        infoOpen: false,
      });
    };

    this.handleDataClose = () => {
      history.replaceState(
        null,
        null,
        '/');
      this.setState({ viewingData: false });
    };

    this.handleInfoOpen = () => {
      this.setState({ infoOpen: true });
    };

    this.handleInfoClose = () => {
      this.setState({ infoOpen: false });
    };
  }

  componentWillMount() {
    // Handle coordinates in url
    const { hash } = window.location;
    if (hash) {
      const link = hash.split('#').pop();
      const re = /(-?\d+.?\d*),(-?\d+.?\d*)/;
      const matches = link.match(re);
      if (matches && matches.length === 3) {
        // The url has a coordinate in it
        const [, reqLatS, reqLngS] = matches;

        const reqLatN = Number(reqLatS);
        const reqLngN = Number(reqLngS);
        if (reqLatN >= 0 && reqLatN <= 180 &&
          reqLngN >= -90 && reqLngN <= 90) {
          // The coordinates are valid
          this.handleDataOpen({ lat: reqLatN, lng: reqLngN });
          return;
        }
      }
    }

    // Otherwise open info
    this.setState({ infoOpen: true });
  }

  render() {
    const { viewingData, infoOpen } = this.state;

    let rainDataDisplay = 'none';
    let appBarDisplay = 'flex';
    let appBarOffset = 64;
    if (viewingData) {
      // Display rain data
      rainDataDisplay = 'inline';

      // Don't display app bar
      appBarDisplay = 'none';
      appBarOffset = 0;
    }

    return (
      <MuiThemeProvider muiTheme={getTheme()}>
        <div className="App">
          <AppBar
            title="Rainfall Explorer"
            showMenuIconButton={false}
            style={{
              display: appBarDisplay,
            }}
            // Info button
            iconElementRight={
              <IconButton onClick={this.handleInfoOpen}>
                <InfoOutline />
              </IconButton>
            }
          />
          <InfoDialog handleClose={this.handleInfoClose} open={infoOpen} />
          <div style={{
            position: 'fixed',
            width: '100vw',
            top: `${appBarOffset}px`,
            bottom: '0px',
          }}
          >
            <Map
              locationPicked={this.handleDataOpen}
              center={this.state.mapCenter}
            />
          </div>
          <div style={{
            position: 'fixed',
            width: '100vw',
            top: `${appBarOffset}px`,
            bottom: '0px',
            display: rainDataDisplay,
          }}
          >
            <RainData
              returnToMap={this.handleDataClose}
              location={this.state.location}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
