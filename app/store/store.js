import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

// Reducers
import reducers from "./reducers";

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const makeStore = (initialState, options) => {
  return createStore(
    reducers, // Reducers
    initialState, // Estado inicial
    bindMiddleware([reduxThunk])
  );
};

export default makeStore;
