import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

/*
  Displayed on page load and when info button is pressed
*/

function InfoDialog(props) {
  const { handleClose, open } = props;
  const actions = [
    <RaisedButton
      label="Ok"
      primary
      onClick={handleClose}
    />,
  ];

  return (
    <Dialog
      title="Rainfall Explorer"
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={handleClose}
      contentStyle={{ maxWidth: '640px' }}
    >
      <p>
        Click anywhere on the map to get rainfall data.
        <br />
        The graph will contain 30 days of historical data and a 7 forecast.
      </p>
    </Dialog>
  );
}

InfoDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default InfoDialog;
