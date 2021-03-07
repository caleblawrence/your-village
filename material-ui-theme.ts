import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#010101",
    },
    type: "dark",
    primary: {
      main: "#acdbdf",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#69779b",
    },
  },
});
export default theme;
