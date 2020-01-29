import React, { useState } from "react";
import Head from "next/head";
import axios from "axios";

// Actions
import { showMenuMobileAction } from "../../store/actions/appActions";

const UploadBook = () => {
  const [cover, setCover] = useState(null);

  const onChangeCover = e => {
    setCover(e.target.files[0]);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bookCover", cover);
    await axios
      .post("/api/books/upload", formData)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
    // .finally(() => setLoading(false));
  };

  return (
    <>
      <Head>
        <title>Nuevo Libro | Granger </title>
      </Head>
      <div>
        <h1>Nuevo libro</h1>
        <form>
          <input type="file" onChange={onChangeCover} />

          <button onClick={onSubmit}>Subir</button>
        </form>
      </div>
    </>
  );
};

UploadBook.getInitialProps = async ({ store }) => {
  store.dispatch(showMenuMobileAction(false));
  return {};
};

export default UploadBook;
