import bundle from './i18n/it-IT'
import * as ReactDOM from "react-dom";
import * as React from "react";
import Router from './routes'
import app from './app'

app.setBundle(bundle)

ReactDOM.render(
  <Router />,
  document.getElementById("main")
);

