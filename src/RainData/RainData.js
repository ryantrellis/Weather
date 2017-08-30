import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import './RainData.css';

function RainData({ returnToMap, location }) {
  const { lat, lng } = location;
  return (
    <div className="RainData">
      RainData!
      lat: {lat}
      lng: {lng}
      <RaisedButton label="Default" onClick={returnToMap} />
    </div>
  );
}

RainData.propTypes = {
  returnToMap: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default RainData;
