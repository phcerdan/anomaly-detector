import { configureStore } from "@reduxjs/toolkit";
import networkReducer from "./network";

const store = configureStore({
  reducer: {
    network: networkReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
