// Types
import {
  SHOW_SESSION_MODAL,
  SHOW_LOGOUT_MODAL,
  SHOW_MENU_MOBILE,
  SHOW_DROPDOWN_PROFILE
} from "../types/appTypes";

const INITIAL_STATE = {
  showSessionModal: false,
  showLogoutModal: false,
  showMenuMobile: false,
  showDropdownProfile: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_SESSION_MODAL:
      return {
        ...state,
        showSessionModal: action.payload.showSessionModal
      };
    case SHOW_LOGOUT_MODAL:
      return {
        ...state,
        showLogoutModal: action.payload.showLogoutModal
      };
    case SHOW_MENU_MOBILE:
      return {
        ...state,
        showMenuMobile: action.payload.showMenuMobile
      };
    case SHOW_DROPDOWN_PROFILE:
      return {
        ...state,
        showDropdownProfile: action.payload.showDropdownProfile
      };
    default:
      return state;
  }
};
