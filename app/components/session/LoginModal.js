import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import nookies from "nookies";

// Actions
import { showSessionModalAction } from "../../store/actions/appActions";
import { loginAction } from "../../store/actions/sessionActions";

// Components
import Loading from "../../components/core/Loading";
import Notification from "../../components/core/Notification";

const LoginModal = ({ state, actions }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleCloseModal = () => actions.showModal(false);

  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);

    await axios
      .post("http://localhost:4000/api/auth/signin", {
        email: user.email,
        password: user.password
      })
      .then(({ data }) => {
        nookies.set({}, "token", data.data.token); // Cookie token user
        actions.login(data.data);
        handleCloseModal();
      })
      .catch(err => {
        console.log(err);
        if (err.response.data.code == "auth/Wrong-email-or-password") {
          setError(err.response.data.message.es);
          setTimeout(() => setError(null), 5000);
        } else {
          setError("Error desconocido");
          setTimeout(() => setError(null), 5000);
        }
      })
      .finally(() => setLoading(false));
  };

  const closeNotification = () => {
    setError(null);
  };

  return (
    <div className={`modal ${state.showModal ? "is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <form onSubmit={handleSubmit}>
          <header className="modal-card-head">
            <p className="modal-card-title">Bienvenido</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={handleCloseModal}
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <div className="control">
                <label htmlFor="LoginEmail">Correo Electrónico</label>
                <input
                  className="input is-light"
                  type="email"
                  id="LoginEmail"
                  name="email"
                  placeholder="example@email.com"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <label htmlFor="LoginPassword">Contraseña</label>
                <input
                  className="input is-light"
                  type="password"
                  id="LoginPassword"
                  name="password"
                  placeholder="******"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {loading && <Loading />}
            {error && (
              <Notification
                type="is-danger"
                message={error}
                close={closeNotification}
              />
            )}
          </section>
          <footer
            className="modal-card-foot"
            style={{
              justifyContent: "flex-end"
            }}
          >
            <button type="button" className="button" onClick={handleCloseModal}>
              Cancelar
            </button>
            <button className="button is-primary">Iniciar Sesión</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = reducers => {
  return {
    state: {
      showModal: reducers.app.showSessionModal
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      showModal: show => dispatch(showSessionModalAction(show)),
      login: user => dispatch(loginAction(user))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
