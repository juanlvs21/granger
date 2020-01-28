import React, { useState } from "react";
import Head from "next/head";

// Actions
import { showMenuMobileAction } from "../store/actions/appActions";

// Components
import Carousel from "../components/home/Carousel";
import BookCard from "../components/book/BookCard";

const Home = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Harry Potter y la Piedra Filosofal",
      img: "/books/cover/hppf.jpg",
      price: 100
    },
    {
      id: 2,
      title: "Harry Potter y el Caliz de Fuego",
      img: "/books/cover/hppf.jpg",
      price: 80
    },
    {
      id: 3,
      title: "Harry Potter y la Camara de los Secretos",
      img: "/books/cover/hppf.jpg",
      price: 95
    },
    {
      id: 4,
      title: "Harry Potter y las Reliquias de la Muerte",
      img: "/books/cover/hppf.jpg",
      price: 105
    },
    {
      id: 5,
      title: "Harry Potter y el Principe Mestizo",
      img: "/books/cover/hppf.jpg",
      price: 95
    },
    {
      id: 6,
      title: "Harry Potter y la Orden de Fenix",
      img: "/books/cover/hppf.jpg",
      price: 95
    }
  ]);

  const renderBooks = books.map(book => (
    <div className="column is-3" key={book.id}>
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
          Más populares
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
