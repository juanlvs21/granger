import React, { useState } from "react";
import Head from "next/head";
import Router from "next/router";
import { connect } from "react-redux";
import axios from "axios";

// Actions
import { loginAction } from "../../store/actions/sessionActions";
import { showMenuMobileAction } from "../../store/actions/appActions";

// Components
import Notification from "../../components/core/Notification";
import Loading from "../../components/core/Loading";

const Signup = ({ actions }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verifyPassword: ""
  });

  const handleChange = e => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);

    if (newUser.password != newUser.verifyPassword) {
      setLoading(false);
      setError("La contraseña no coincide");
      setTimeout(() => setError(null), 5000);
    } else {
      await axios
        .post("http://localhost:4000/api/auth/signup", {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password
        })
        .then(({ data }) => {
          if (data.code == "auth/user-exists") {
            setError(data.message.es);
            setTimeout(() => setError(null), 5000);
          } else {
            actions.login(data.data);
            Router.replace("/");
          }
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  const closeNotification = () => {
    setError(null);
  };

  return (
    <>
      <Head>
        <title>Registrarse | Granger </title>
      </Head>
      <div className="granger__session-page-container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="card-content">
              <h1 className="title has-text-centered">Únete y Disfruta</h1>

              <div className="content">
                <div className="field">
                  <div className="control">
                    <label htmlFor="signupFirstName">Nombre</label>
                    <input
                      className="input is-light"
                      type="text"
                      id="signupFirstName"
                      name="firstName"
                      placeholder="Nombre"
                      value={newUser.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <label htmlFor="signupLastName">Apellido</label>
                    <input
                      className="input is-light"
                      type="text"
                      id="signupLastName"
                      name="lastName"
                      placeholder="Apellido"
                      value={newUser.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <label htmlFor="signupEmail">Correo Electrónico</label>
                    <input
                      className="input is-light"
                      type="email"
                      id="signupEmail"
                      name="email"
                      placeholder="example@email.com"
                      value={newUser.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <label htmlFor="signupPassword">Contraseña</label>
                    <input
                      className="input is-light"
                      type="password"
                      id="signupPassword"
                      name="password"
                      placeholder="Contraseña"
                      value={newUser.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <label htmlFor="signupVerifyPassword">
                      Verificar Contraseña
                    </label>
                    <input
                      className="input is-light"
                      type="password"
                      id="signupVerifyPassword"
                      name="verifyPassword"
                      placeholder="Verificar Contraseña"
                      value={newUser.verifyPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
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
            </div>

            <footer className="card-footer">
              <div className="card-footer-item">
                <button className="btn button is-primary">Registrarse</button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </>
  );
};

Signup.getInitialProps = async ({ store }) => {
  store.dispatch(showMenuMobileAction(false));
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      login: user => dispatch(loginAction(user))
    }
  };
};

export default connect(null, mapDispatchToProps)(Signup);
