import React from "react";
import Head from "next/head";

// Actions
import { showMenuMobileAction } from "../store/actions/appActions";

// Components
import Carousel from "../components/home/Carousel";
import CarouselFeaturedBooks from "../components/book/CarouselFeaturedBooks";
import BookCard from "../components/book/BookCard";

// Service API
import API from "../utils/API";

const Home = ({ books }) => {
  const renderNewBooks = () => {
    return books.map(book => <BookCard book={book} key={book.uuid} />);
  };

  return (
    <>
      <Head>
        <title>Inicio | Granger </title>
      </Head>
      <Carousel />
      <section className="section container is-fluid">
        <h1 className="is-size-2 has-text-centered has-text-weight-semibold">
          Libros Destacados
        </h1>
        <div>
          <CarouselFeaturedBooks featuredBooks={books} />
        </div>
      </section>
      <section className="section container is-fluid">
        <h1 className="is-size-2 has-text-centered has-text-weight-semibold">
          Libros Nuevos
        </h1>
        <div className="granger__books-container">{renderNewBooks()}</div>
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

  const service = new API();

  let books = [];

  await service
    .getAllBooks()
    .then(({ data }) => {
      books = data.data;
    })
    .catch(err => {
      console.log(err);
    });

  return { books };
};

export default Home;
