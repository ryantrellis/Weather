import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import './Map.css';

function Map({ locationPicked }) {
  return (
    <div className="Map">
      Map!
      <RaisedButton label="Default" onClick={locationPicked} />
    </div>
  );
}

Map.propTypes = {
  locationPicked: PropTypes.func.isRequired,
};

export default Map;
