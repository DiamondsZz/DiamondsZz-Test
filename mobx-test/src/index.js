import "./styles/appleBasket.scss";
import "./styles/appleItem.scss";

import React from "react";
import ReactDOM from "react-dom";

import Apple from "./user-mobx/apple";
import { autorun } from "mobx";
import { Provider } from "mobx-react";
import store from "./user-mobx"

autorun(() => {
  if (store.isPicking) {
    console.log("is picking");
  }
  console.log(store, "apples");
});

ReactDOM.render(
  <Provider store={store}>
    <Apple />
  </Provider>,
  document.getElementById("app")
);
