import React from "react";
import Link from "next/link";

// Font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const BookCard = ({ book }) => {
  return (
    <>
      <div className="granger__book-card">
        <img
          className="granger__book-card-img"
          src={`${process.env.URL_SERVER}/uploads/cover/${book.slug}/${book.cover}`}
          alt={book.title}
        />

        <div className="granger__book-card-details">
          <button
            className="granger__book-card-details-btn-fav"
            data-title="Añadir a Favoritos"
          >
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </button>

          <p className="granger__book-card-details-title">{book.title}</p>
          <p className="granger__book-card-details-authors">
            <i>{book.authors}</i>
          </p>
          <Link href="/books/[slug]" as={`/books/${book.uuid}`}>
            <a className="button is-small is-primary is-rounded">Ver más</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BookCard;
