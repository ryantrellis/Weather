import React, { Component } from 'react';

const Plotly = window.Plotly;

// const d3 = Plotly.d3;
// const WIDTH_IN_PERCENT_OF_PARENT = 60;
// const HEIGHT_IN_PERCENT_OF_PARENT = 80;

const trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter',
};

const trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter',
};

const data = [trace1, trace2];


class RainDataGraph extends Component {
  constructor(props) {
    super(props);
    this.updateGraph = () => {
      Plotly.Plots.resize(this.graphDiv);
    };
  }

  componentDidMount() {
    Plotly.newPlot(this.graphDiv, data);
    window.addEventListener('resize', this.updateGraph);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateGraph);
  }

  render() {
    return (
      <div
        ref={(graphDiv) => { this.graphDiv = graphDiv; }}
        style={{ height: '100%', width: '100%' }}
      />
    );
  }
}

export default RainDataGraph;
