import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import muiThemeable from 'material-ui/styles/muiThemeable';
import RainDataGraph from './RainDataGraph';

function RainData({ returnToMap, isFetching, locationData, error, muiTheme }) {
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
        style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
        hourlyData={locationData.hourlyData}
        city={locationData.city}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        zIndex: 2,
        height: '100%',
        width: '100%',
        background: canvasColor,
      }}
    >
      <div style={{ position: 'fixed', margin: '10px', zIndex: 10 }}>
        <FloatingActionButton label="Default" onClick={returnToMap}>
          <ArrowBack />
        </FloatingActionButton>
      </div>
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
  muiTheme: PropTypes.shape({
    spacing: PropTypes.object,
    fontFamily: PropTypes.string,
    palette: PropTypes.object,
  }).isRequired,
};

export default muiThemeable()(RainData);
