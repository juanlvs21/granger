import React from "react";
import Router from "next/router";
import { connect } from "react-redux";
import nookies, { destroyCookie } from "nookies";

// Actions
import {
  showLogoutModalAction,
  showMenuMobileAction,
  showDropdownProfileAction
} from "../../store/actions/appActions";
import { loginAction } from "../../store/actions/sessionActions";

const LogoutConfirmModal = ({ state, actions }) => {
  const handleCloseModal = () => {
    actions.closeModal(false);
    actions.closeMenuMobile();
    actions.closeDropdownProfile();
  };

  const handleLogout = () => {
    handleCloseModal();
    nookies.destroy({}, "token");
    actions.logout();
    Router.replace(Router.route);
  };

  return (
    <div className={`modal ${state.showModal ? "is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title has-text-centered">
            ¿Está seguro que desea cerrar sesión?
          </p>
          <button
            type="button"
            className="delete"
            aria-label="close"
            onClick={handleCloseModal}
          ></button>
        </header>
        <footer
          className="modal-card-foot"
          style={{
            justifyContent: "center"
          }}
        >
          <button type="button" className="button" onClick={handleCloseModal}>
            Cancelar
          </button>
          <button className="button is-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </footer>
      </div>
    </div>
  );
};

const mapStateToProps = reducers => {
  return {
    state: {
      showModal: reducers.app.showLogoutModal
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      closeModal: show => dispatch(showLogoutModalAction(show)),
      closeMenuMobile: () => dispatch(showMenuMobileAction(false)),
      closeDropdownProfile: () => dispatch(showDropdownProfileAction(false)),
      logout: () => dispatch(loginAction(null))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutConfirmModal);
