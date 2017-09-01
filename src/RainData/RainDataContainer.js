import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RainData from './RainData';
import fetchRainData, { getCoordinateIndex } from './RainDataActions';

/* 
  Handles interaction with network and redux for RainData
*/

class RainDataContainer extends Component {
  componentDidMount() {
    const { location, getRainData } = this.props;
    getRainData(location);
  }

  render() {
    return (
      <RainData
        returnToMap={this.props.returnToMap}
        locationData={this.props.locationData}
        isFetching={this.props.isFetching}
        error={this.props.error}
      />
    );
  }
}

function mapStateToProps({ rainData }, ownProps) {
  const { location, getRainData, returnToMap } = ownProps;
  let isFetching = true;
  let locationData = {};
  let error = null;

  // Set isFetching, error, locationData if they exist
  const locationDataObj = rainData[getCoordinateIndex(location)];
  if (locationDataObj !== undefined) {
    isFetching = locationDataObj.isFetching;
    if (locationDataObj.error !== undefined) {
      error = locationDataObj.error.message;
    }
    if (locationDataObj.data !== undefined) {
      locationData = locationDataObj.data;
    }
  }

  return {
    isFetching,
    location,
    locationData,
    getRainData,
    returnToMap,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRainData: coordinates => dispatch(fetchRainData(coordinates)),
  };
}

RainDataContainer.propTypes = {
  getRainData: PropTypes.func.isRequired,
  returnToMap: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  locationData: PropTypes.shape({
    city: PropTypes.string,
    dailyData: PropTypes.object,
  }),
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RainDataContainer);
