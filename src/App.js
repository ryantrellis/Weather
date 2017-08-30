import React, { Component } from 'react';
import './App.css';

/*
  Controls which screen is displaying (map or rain data)
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewingData: false,
    };
  }

  render() {
    return (
      <div className="App">
        <div className="map">
          Map!
        </div>
        <div className="rainData">
          Rain data!
        </div>
      </div>
    );
  }
}

export default App;
