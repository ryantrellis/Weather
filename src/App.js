import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import IconButton from 'material-ui/IconButton';

import './App.css';
import RainData from './RainData/RainData';
import Map from './Map/Map';

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
    );
  }
}

export default App;
