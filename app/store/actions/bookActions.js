// Types
import { GENRES_SELECTED } from "../types/bookTypes";

export const addGenresSelectedAction = genresSelected => dispatch => {
  dispatch({
    type: GENRES_SELECTED,
    payload: {
      genresSelected
    }
  });
};
