import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Plotly = window.Plotly;

function convertDataForPlotly(data, multiplyer) {
  /* Schema in redux
  {
    YYYYMMDD: Number
  } */
  const o = { x: [], y: [] };
  Object.keys(data).forEach((key) => {
    const date = moment(key, 'YYYYMMDD');
    o.x.push(date.format());

    // Adjust unit with multiplyer
    o.y.push(data[key] * multiplyer);
  });
  return o;
}

class RainDataGraph extends Component {
  constructor(props) {
    super(props);

    this.getData = (nextProps) => {
      const { hourlyData, unitInfo } = nextProps;
      return Object.assign({},
        convertDataForPlotly(hourlyData, unitInfo.multiplyer),
        this.format);
    };

    this.resizePlot = () => {
      Plotly.Plots.resize(this.graphDiv);
    };

    this.getPlotLayout = (nextProps) => {
      const { city, unitInfo } = nextProps;
      const today = moment()
        .hour(0)
        .minute(0)
        .second(0)
        .format();
      return {
        title: city ? `Rainfall in ${city}` : 'Rainfall',
        xaxis: {
        },
        yaxis: {
          title: `Daily Rainfall (${unitInfo.text})`,
          hoverformat: '.2f',
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
        margin: {
          l: 64,
          r: 0,
          b: 0,
          t: 100,
          pad: 4,
        },
      };
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
    Plotly.newPlot(this.graphDiv, [this.getData(this.props)], this.getPlotLayout(this.props));
    window.addEventListener('resize', this.resizePlot);
  }

  componentWillReceiveProps(nextProps) {
    console.log('newData: ', this.getData(nextProps));
    Plotly.newPlot(this.graphDiv, this.getData(nextProps), this.getPlotLayout(nextProps));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizePlot);
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
  unitInfo: PropTypes.shape({
    multiplyer: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default RainDataGraph;
