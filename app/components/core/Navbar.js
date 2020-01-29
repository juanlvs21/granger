import React, { useState, useEffect } from "react";
import Link from "next/link";
import { connect } from "react-redux";

// Actions
import {
  showSessionModalAction,
  showLogoutModalAction,
  showMenuMobileAction,
  showDropdownProfileAction
} from "../../store/actions/appActions";

const Navbar = ({ state, actions }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleShowSessionModal = () => actions.showSessionModal(true);
  const handleShowLogoutModal = () => actions.showLogoutModal(true);
  const handleShowMenu = () => actions.showMenuMobile(state.showMenuMobile);
  const handleShowDropdownProfile = () =>
    actions.showDropdownProfile(state.showDropdownProfile);

  return (
    <>
      <nav
        className="navbar is-primary"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link href="/">
            <a className="navbar-item">
              <b>Granger</b>
            </a>
          </Link>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            onClick={handleShowMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          className={`navbar-menu ${state.showMenuMobile ? "is-active" : ""}`}
        >
          <div className="navbar-start">
            <Link href="/">
              <a className="navbar-item">Inicio</a>
            </Link>

            <Link href="/books">
              <a className="navbar-item">Libros</a>
            </Link>

            <div className="navbar-item">
              <input
                className="input is-rounded is-small is-primary"
                type="text"
                placeholder="Buscar libro"
              ></input>
            </div>
          </div>
          <div className="navbar-end">
            {!state.user ? (
              <div className="navbar-item">
                <div className="buttons">
                  <Link href="/auth/signup">
                    <a className="button is-primary is-small">Registrar</a>
                  </Link>
                  <a
                    className="button is-light is-small"
                    onClick={handleShowSessionModal}
                  >
                    Entrar
                  </a>
                </div>
              </div>
            ) : (
              <>
                {state.user.admin && (
                  <Link href="/books/upload">
                    <a className="navbar-item button is-info is-small is-rounded granger__book-new-btn">
                      Nuevo Libro
                    </a>
                  </Link>
                )}
                <div
                  className={`navbar-item has-dropdown ${
                    state.showDropdownProfile ? "is-active" : ""
                  }`}
                >
                  <a
                    className="navbar-link"
                    onClick={handleShowDropdownProfile}
                  >
                    <b>{state.user.firstName}</b>
                  </a>
                  <div className="navbar-dropdown is-right">
                    <Link href="/profile">
                      <a className="navbar-item">Perfil</a>
                    </Link>
                    <a className="navbar-item" onClick={handleShowLogoutModal}>
                      Salir
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <style jsx>{`
        .granger__book-new-btn {
          margin-top: 12px;
          font-weight: bold;
        }

        @media (max-width: 1023px) {
          .granger__book-new-btn {
            margin: 0px 12px;
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

const mapStateToProps = reducers => {
  return {
    state: {
      user: reducers.session.user,
      showMenuMobile: reducers.app.showMenuMobile,
      showDropdownProfile: reducers.app.showDropdownProfile
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      showSessionModal: show => dispatch(showSessionModalAction(show)),
      showLogoutModal: show => dispatch(showLogoutModalAction(show)),
      showMenuMobile: showMenuMobile =>
        dispatch(showMenuMobileAction(!showMenuMobile)),
      showDropdownProfile: showDropdownProfile =>
        dispatch(showDropdownProfileAction(!showDropdownProfile)),
      logout: () => dispatch(loginAction(null))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
