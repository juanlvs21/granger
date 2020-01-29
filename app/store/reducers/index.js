import { combineReducers } from "redux";

// Reducers
import appReducer from "./appReducer";
import sessionReducer from "./sessionReducer";

export default combineReducers({
  app: appReducer,
  session: sessionReducer
});
