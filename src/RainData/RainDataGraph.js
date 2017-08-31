import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Plotly = window.Plotly;

function convertDataForPlotly(data) {
  /* Schema in redux
  {
    YYYYMMDD: Number
  } */
  const o = { x: [], y: [] };
  Object.keys(data).forEach((key) => {
    const date = moment(key, 'YYYYMMDD');
    o.x.push(date.format());
    o.y.push(data[key]);
  });
  return o;
}

class RainDataGraph extends Component {
  constructor(props) {
    super(props);
    const { city } = this.props;
    this.updateGraph = () => {
      Plotly.Plots.resize(this.graphDiv);
    };

    const today = moment()
      .hour(0)
      .minute(0)
      .second(0)
      .format();
    this.layout = {
      title: city ? `Rainfall in ${city}` : 'Rainfall',
      xaxis: {
      },
      yaxis: {
        title: 'Daily Rainfall in MM',
      },
      shapes: [{
        type: 'line',
        x0: today,
        x1: today,
        yref: 'paper',
        y0: 0.05, // Stop at x axis
        y1: 1,
        line: {
          color: 'grey',
          width: 3,
          dash: 'dot',
        },
      }],
    };

    this.format = {
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        dash: 'dash',
        width: 1,
      },
      marker: {
        size: 8,
      },
    };
  }

  componentDidMount() {
    const { hourlyData } = this.props;
    const data = Object.assign({}, convertDataForPlotly(hourlyData), this.format);
    console.log('data: ', data);

    Plotly.newPlot(this.graphDiv, [data], this.layout);
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

RainDataGraph.propTypes = {
  hourlyData: PropTypes.objectOf(PropTypes.number.isRequired).isRequired,
  city: PropTypes.string.isRequired,
};

export default RainDataGraph;
