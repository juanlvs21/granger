import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";

// Actions
import { showMenuMobileAction } from "../store/actions/appActions";

// Components
import Carousel from "../components/home/Carousel";
import BookCard from "../components/book/BookCard";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function getAllBooks() {
      await axios
        .get("http://localhost:4000/api/books/all")
        .then(({ data }) => {
          setBooks(data.data);
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (books.length == 0) {
      getAllBooks();
    }
  });

  const renderBooks = books.map(book => (
    <div className="column is-3" key={book._id}>
      <BookCard book={book} />
    </div>
  ));

  return (
    <>
      <Head>
        <title>Inicio | Granger </title>
      </Head>
      <Carousel />
      <section className="section container is-fluid">
        <h1 className="is-size-2 has-text-centered has-text-weight-semibold">
          Más vendidos
        </h1>
        <div className="columns is-gapless is-multiline">{renderBooks}</div>
      </section>
      <section className="section container is-fluid">
        <h1 className="is-size-2 has-text-centered has-text-weight-semibold">
          Libros Nuevos
        </h1>
        <div className="columns is-gapless is-multiline">{renderBooks}</div>
      </section>

      <style jsx>{`
        h1 {
          margin-bottom: 30px;
        }
      `}</style>
    </>
  );
};

Home.getInitialProps = async ({ store }) => {
  store.dispatch(showMenuMobileAction(false));
  return {};
};

export default Home;
