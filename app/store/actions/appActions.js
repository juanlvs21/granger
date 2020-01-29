// Types
import {
  SHOW_SESSION_MODAL,
  SHOW_LOGOUT_MODAL,
  SHOW_MENU_MOBILE,
  SHOW_DROPDOWN_PROFILE
} from "../types/appTypes";

export const showSessionModalAction = showSessionModal => dispatch => {
  dispatch({
    type: SHOW_SESSION_MODAL,
    payload: {
      showSessionModal
    }
  });
};

export const showLogoutModalAction = showLogoutModal => dispatch => {
  dispatch({
    type: SHOW_LOGOUT_MODAL,
    payload: {
      showLogoutModal
    }
  });
};

export const showMenuMobileAction = showMenuMobile => dispatch => {
  dispatch({
    type: SHOW_MENU_MOBILE,
    payload: {
      showMenuMobile
    }
  });
};

export const showDropdownProfileAction = showDropdownProfile => dispatch => {
  dispatch({
    type: SHOW_DROPDOWN_PROFILE,
    payload: {
      showDropdownProfile
    }
  });
};
