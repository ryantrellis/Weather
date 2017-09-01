import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RainData from './RainData';
import fetchRainData, { getCoordinateIndex } from './RainDataActions';

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

RainDataContainer.propTypes = {
  getRainData: PropTypes.func.isRequired,
  returnToMap: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  locationData: PropTypes.shape({
    city: PropTypes.string.isRequired,
    hourlyData: PropTypes.object.isRequired,
  }),
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

function mapStateToProps({ rainData }, ownProps) {
  const { location, getRainData, returnToMap } = ownProps;
  const locationDataObj = rainData[getCoordinateIndex(location)];
  let isFetching = true;
  let locationData;
  let error = null;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RainDataContainer);
