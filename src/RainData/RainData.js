import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import './RainData.css';

function RainData({ returnToMap, isFetching, locationData, error }) {
  let content;
  if (error) {
    content = (
      <div>
        <h1>
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
      <div>
        {locationData.city}
        <RaisedButton label="Default" onClick={returnToMap} />
      </div>
    );
  }
  return (
    <div className="RainData">
      {content}
    </div>
  );
}

RainData.propTypes = {
  returnToMap: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  locationData: PropTypes.shape({
    city: PropTypes.string.isRequired,
    hourlyData: PropTypes.object.isRequired,
  }),
  error: PropTypes.string,
};

export default RainData;
