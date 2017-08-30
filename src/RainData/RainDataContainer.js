import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

import RainData from './RainData';

class RainDataContainer extends Component {
  componentDidMount() {
    const { location } = this.props;
    console.log(location);
  }

  render() {
    return (
      <RainData />
    );
  }
}

RainDataContainer.propTypes = {
  // returnToMap: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default RainDataContainer;
