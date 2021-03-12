import { combineReducers } from "redux";
import networkReducer from "./network";

const rootReducer = combineReducers({
  network: networkReducer,
});

export default rootReducer;
