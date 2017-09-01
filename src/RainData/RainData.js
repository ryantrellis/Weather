import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import muiThemeable from 'material-ui/styles/muiThemeable';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import RainDataGraph from './RainDataGraph';

let defaultUnit = 0;
function getUnitInfo(unit) {
  switch (unit) {
    case 0: {
      return {
        multiplyer: 1,
        text: 'mm',
      };
    }
    // in
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
      // Remember user's choice when they close and reopen a rainData view
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
    let content;
    if (error) {
      content = (
        <div style={{ textAlign: 'center', width: '100%' }} >
          <h1 style={{ color: textColor, fontFamily }}>
            Error: {error}
          </h1>
        </div>
      );
    } else if (isFetching) {
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
      content = (
        <RainDataGraph
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          hourlyData={locationData.hourlyData}
          city={locationData.city}
          unitInfo={getUnitInfo(this.state.unit)}
        />
      );
    }

    return (
      <div
        style={{
          zIndex: 2,
          height: '100%',
          width: '100%',
          background: canvasColor,
        }}
      >
        <div style={{
          position: 'fixed',
          margin: '10px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          paddingLeft: '10px',
        }}
        >
          <FloatingActionButton
            label="Default"
            onClick={returnToMap}
          >
            <ArrowBack />
          </FloatingActionButton>
          <SelectField
            floatingLabelText="Unit"
            style={{ paddingLeft: '30px', width: '85px' }}
            value={this.state.unit}
            onChange={this.updateUnit}
          >
            <MenuItem value={0} primaryText="mm" />
            <MenuItem value={1} primaryText="in" />
          </SelectField>
        </div>
        {content}
      </div>
    );
  }
}

RainData.propTypes = {
  returnToMap: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  locationData: PropTypes.shape({
    city: PropTypes.string.isRequired,
    hourlyData: PropTypes.object.isRequired,
  }),
  error: PropTypes.string,
  muiTheme: PropTypes.shape({
    spacing: PropTypes.object,
    fontFamily: PropTypes.string,
    palette: PropTypes.object,
  }).isRequired,
};

export default muiThemeable()(RainData);
