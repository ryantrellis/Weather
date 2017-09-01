import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import muiThemeable from 'material-ui/styles/muiThemeable';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import RainDataGraph from './RainDataGraph';

// Unit to display graph in
let defaultUnit = 0;
function getUnitInfo(unit) {
  switch (unit) {
    case 0: {
      return {
        multiplyer: 1,
        text: 'mm',
      };
    }
    case 1: {
      return {
        multiplyer: 0.0393701,
        text: 'in',
      };
    }
    default: {
      throw Error('Invalid index');
    }
  }
}

class RainData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unit: defaultUnit,
    };

    this.updateUnit = (_, value) => {
      this.setState({
        unit: value,
      });
      // Save users choice for when they close and reopen a rainData view
      defaultUnit = value;
    };
  }

  render() {
    const {
      returnToMap,
      isFetching,
      locationData,
      error,
      muiTheme,
    } = this.props;
    const { fontFamily, palette } = muiTheme;
    const { canvasColor, textColor } = palette;

    // Unit changer should only be displayed if the graph is displayed
    const unitVisiblity = { display: 'none' };

    // Content can be a loading spinner, the graph, or an error message
    let content;

    if (error) {
      // Display error message
      content = (
        <div style={{ textAlign: 'center', width: '100%' }} >
          <h1 style={{ color: textColor, fontFamily }}>
            Error: {error}
          </h1>
        </div>
      );
    } else if (isFetching) {
      // Display spinner
      const size = 120;
      content = (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <CircularProgress
            size={size}
            thickness={5}
            style={{
              marginLeft: '50%',
              left: (size / 2) * -1,
              top: '30%',
            }}
          />;
        </div>
      );
    } else {
      // Display graph
      unitVisiblity.display = 'inline';
      content = (
        <RainDataGraph
          dailyData={locationData.dailyData}
          city={locationData.city}
          unitInfo={getUnitInfo(this.state.unit)}
        />
      );
    }

    return (
      // This div contains (back button, unit changer) and graph
      <div
        style={{
          zIndex: 2,
          height: '100%',
          width: '100%',
          background: canvasColor,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* This div contains back button and unit changer */}
        <div style={{
          marginTop: '10px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          paddingLeft: '10px',
          flex: '0 1 auto',
        }}
        >
          {/* Back button */}
          <FloatingActionButton
            label="Default"
            onClick={returnToMap}
          >
            <ArrowBack />
          </FloatingActionButton>

          {/* Unit Changer */}
          <SelectField
            floatingLabelText="Unit"
            style={{ paddingLeft: '30px', width: '85px', ...unitVisiblity }}
            value={this.state.unit}
            onChange={this.updateUnit}
          >
            <MenuItem value={0} primaryText="mm" />
            <MenuItem value={1} primaryText="in" />
          </SelectField>
        </div>

        {/* Graph / spinner / error */}
        <div style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        >
          {content}
        </div>
      </div>
    );
  }
}

RainData.propTypes = {
  returnToMap: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  locationData: PropTypes.shape({
    city: PropTypes.string,
    dailyData: PropTypes.object,
  }),
  error: PropTypes.string,
  muiTheme: PropTypes.shape({
    spacing: PropTypes.object,
    fontFamily: PropTypes.string,
    palette: PropTypes.object,
  }).isRequired,
};

export default muiThemeable()(RainData);
