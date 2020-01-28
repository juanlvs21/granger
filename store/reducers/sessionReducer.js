// Types
import { LOGIN } from "../types/sessionTypes";

const INITIAL_STATE = {
  user: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
};
