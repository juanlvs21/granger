import { combineReducers } from "redux";

// Reducers
import appReducer from "./appReducer";
import sessionReducer from "./sessionReducer";
import bookReducer from "./bookReducer";

export default combineReducers({
  app: appReducer,
  session: sessionReducer,
  book: bookReducer
});
