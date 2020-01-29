import React from "react";
import Head from "next/head";

// Actions
import { showMenuMobileAction } from "../../store/actions/appActions";

const Books = () => {
  return (
    <div>
      <Head>
        <title>Libros | Granger </title>
      </Head>
      <h1>Books</h1>
    </div>
  );
};

Books.getInitialProps = async ({ store }) => {
  store.dispatch(showMenuMobileAction(false));
  return {};
};

export default Books;
