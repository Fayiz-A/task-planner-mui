import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);