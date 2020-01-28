// Types
import { LOGIN } from "../types/sessionTypes";

export const loginAction = user => dispatch => {
  dispatch({
    type: LOGIN,
    payload: {
      user
    }
  });
};
