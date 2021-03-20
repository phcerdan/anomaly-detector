import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import store from "./store";
import Client from "./protocols/Client";
import { connectClient, setClient } from "./store/network";

const config = {
  sessionURL: "ws://localhost:1234/ws",
};
store.dispatch(setClient(new Client()));
store.dispatch(connectClient(config));

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
