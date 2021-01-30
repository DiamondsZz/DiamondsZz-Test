import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {Provider}   from "mobx-react"
import countStore from "./stores/countStore"

ReactDOM.render(
  <Provider countStore={countStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
