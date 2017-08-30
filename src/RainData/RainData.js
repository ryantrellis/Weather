import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import './RainData.css';

function RainData({ returnToMap }) {
  return (
    <div className="RainData">
      RainData!
      <RaisedButton label="Default" onClick={returnToMap} />
    </div>
  );
}

RainData.propTypes = {
  returnToMap: PropTypes.func.isRequired,
};

export default RainData;
