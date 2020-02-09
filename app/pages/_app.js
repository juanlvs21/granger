import React from "react";
import App from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { PageTransition } from "next-page-transitions";
import nookies from "nookies";

// Styles
import "../assets/styles/styles.scss";

// Layout
import Layout from "../layout/Default";

// Store
import makeStore from "../store/store";

// Actions
import { loginAction } from "../store/actions/sessionActions";

// Utils
import API from "../utils/API";

// Router Progress bar
Router.events.on("routeChangeStart", url => {
  // console.log(`Loading: ${url}`)
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    // const { session } = ctx.store.getState();

    const { token } = nookies.get(ctx);

    const service = new API();

    if (token) {
      await service
        .token(token)
        .then(({ data }) => {
          nookies.set({}, "token", data.data.token); // Cookie token user
          ctx.store.dispatch(loginAction(data.data));
        })
        .catch(err => console.log(err));
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {
      pageProps
    };
  }

  //   componentDidMount() {
  //     if (typeof window !== "undefined") {
  //       // jQuery
  //       require("jquery");
  //       // Bootstrap
  //       require("bootstrap/dist/css/bootstrap.min.css");
  //       require("bootstrap/dist/js/bootstrap.bundle");
  //       // React table
  //       require("react-table/react-table.css");
  //     }
  //   }

  render() {
    const { Component, pageProps, router, store } = this.props;
    return (
      <Provider store={store}>
        <Layout>
          <PageTransition timeout={300} classNames="fade-in">
            <Component {...pageProps} key={router.route} />
          </PageTransition>
        </Layout>
      </Provider>
    );
  }
}

const mapStateToProps = reducers => {
  return {
    state: {
      showModal: reducers.app.showSessionModal
    }
  };
};

export default withRedux(makeStore)(MyApp);
