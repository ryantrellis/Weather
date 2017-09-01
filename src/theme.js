/* eslint-disable */
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator'

/*
  Theme used by material-UI
  Theme properties are accesible in components via muiThemeable
*/

const getTheme = () => {
  let overwrites = {
    "palette": {
        "primary1Color": "#0097a7",
        "primary2Color": "#00796b",
        "accent1Color": "#9ccc65",
        "accent2Color": "#dcedc8",
        "accent3Color": "#607d8b",
        "textColor": "#000000"
    }
  };
  return getMuiTheme(baseTheme, overwrites);
}

export default getTheme;