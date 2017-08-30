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
    };

    this.viewData = () => {
      this.setState(() => ({
        viewingData: true,
      }));
    };

    this.viewMap = () => {
      this.setState(() => ({
        viewingData: false,
      }));
    };
  }

  render() {
    let screenToDisplay = null;
    const viewingData = this.state.viewingData;
    if (viewingData) {
      screenToDisplay = <RainData returnToMap={this.viewMap} />;
    } else {
      screenToDisplay = <Map locationPicked={this.viewData} />;
    }
    return (
      <MuiThemeProvider muiTheme={getTheme()}>
        <div className="App">
          <AppBar
            title="Title"
            showMenuIconButton={false}
            iconElementRight={<IconButton><InfoOutline /></IconButton>}
          />
          <div className="Screen">
            {screenToDisplay}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
