import { ConnectedRouter } from "connected-react-router"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import Routes from "./Routes"
import store from "./store/index"
import { history } from "./store"
import "./style.css"
import AnotherStore from "./anotherStore"

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AnotherStore>
        <Routes />
      </AnotherStore>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
)
