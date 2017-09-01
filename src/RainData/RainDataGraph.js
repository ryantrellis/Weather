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

    const titlefontFamily = 'Roboto, sans-serif';

    this.lineFormat = {
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

    this.getData = (nextProps) => {
      const { hourlyData, unitInfo } = nextProps;
      return Object.assign(
        {},
        convertDataForPlotly(hourlyData, unitInfo.multiplyer),
        this.lineFormat,
      );
    };

    this.resizePlot = () => {
      const height = this.graphDiv.parentElement.offsetHeight;
      const width = this.graphDiv.parentElement.offsetWidth;
      Plotly.relayout(this.graphDiv, { height, width });
    };

    this.initPlotLayout = () => {
      // Returns the static layout settings
      const today = moment()
        .hour(0)
        .minute(0)
        .second(0)
        .format();
      return {
        shapes: [{
          type: 'line',
          x0: today,
          x1: today,
          yref: 'paper',
          y0: 0.065, // Stop at x axis
          y1: 1,
          line: {
            color: 'grey',
            width: 3,
            dash: 'dot',
          },
        }],
        annotations: [{
          x: today,
          yref: 'paper',
          y: 1.07,
          text: 'Today',
          font: {
            family: titlefontFamily,
            size: 16,
            color: '#000000',
          },
          align: 'center',
          opacity: 0.8,
          showarrow: false,
        }],
        margin: {
          l: 64,
          r: 0,
          b: 50,
          t: 100,
          pad: 4,
        },
        titlefont: {
          family: titlefontFamily,
          size: 28,
          color: '#000000',
        },
        autosize: false,
      };
    };

    this.getPlotLayout = (nextProps) => {
      // Returns the dynamic layout settings
      const { city, unitInfo } = nextProps;
      return {
        title: city ? `Rainfall in ${city}` : 'Rainfall',
        yaxis: {
          title: `Daily Rainfall (${unitInfo.text})`,
          hoverformat: '.2f',
        },
      };
    };

    this.updatePlot = (nextProps) => {
      this.resizePlot();
      Plotly.deleteTraces(this.graphDiv, 0);
      Plotly.relayout(this.graphDiv, this.getPlotLayout(nextProps));
      Plotly.addTraces(this.graphDiv, [this.getData(nextProps)]);
    };
  }

  componentDidMount() {
    Plotly.newPlot(this.graphDiv,
      [this.getData(this.props)],
      this.initPlotLayout(),
      {
        displaylogo: false,
        modeBarButtonsToRemove: [
          'sendDataToCloud',
          'select2d',
          'lasso2d',
          'resetScale2d',
          'hoverClosestCartesian',
          'hoverCompareCartesian',
          'toggleSpikelines',
        ],
      });
    // Update immediatly it to get axis to scale properly
    this.updatePlot(this.props);
    window.addEventListener('resize', this.resizePlot);
  }

  componentWillReceiveProps(nextProps) {
    this.updatePlot(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizePlot);
  }

  render() {
    return (
      <div
        ref={(graphDiv) => { this.graphDiv = graphDiv; }}
        id="plotlyGraphDiv"
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
