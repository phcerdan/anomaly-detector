import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./store";

const store = configureStore({
  reducer: { rootReducer },
  devTools: process.env.NODE_ENV !== "production",
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
