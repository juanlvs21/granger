import React, { Component } from "react";
import Head from "next/head";

// Actions
import { showMenuMobileAction } from "../store/actions/appActions";

// Components
import Carousel from "../components/home/Carousel";
import BookCard from "../components/book/BookCard";

// Service API
import API from "../utils/API";

class Home extends Component {
  constructor() {
    super();

    this.service = new API();

    this.state = {
      books: []
    };
  }

  componentDidMount() {
    this.service
      .getAllBooks()
      .then(({ data }) => {
        this.setState({
          books: data.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderBooks() {
    return this.state.books.map(book => (
      <div className="column is-3" key={book.uuid}>
        <BookCard book={book} />
      </div>
    ));
  }

  render() {
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
          <div className="columns is-gapless is-multiline">
            {this.renderBooks()}
          </div>
        </section>
        <section className="section container is-fluid">
          <h1 className="is-size-2 has-text-centered has-text-weight-semibold">
            Libros Nuevos
          </h1>
          <div className="columns is-gapless is-multiline">
            {this.renderBooks()}
          </div>
        </section>

        <style jsx>{`
          h1 {
            margin-bottom: 30px;
          }
        `}</style>
      </>
    );
  }
}

Home.getInitialProps = async ({ store }) => {
  store.dispatch(showMenuMobileAction(false));
  return {};
};

export default Home;
