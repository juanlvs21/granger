// Types
import { GENRES_SELECTED } from "../types/bookTypes";

const INITIAL_STATE = {
  genresSelected: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GENRES_SELECTED:
      return {
        ...state,
        genresSelected: action.payload.genresSelected
      };
    default:
      return state;
  }
};
