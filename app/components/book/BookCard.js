import React, { useState } from "react";
import Link from "next/link";

// Font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const BookCard = ({ book }) => {
  const URL_COVER = process.env.URL_SERVER
    ? `${process.env.URL_SERVER}/uploads/cover/${book.folder}/${book.cover}`
    : `http://localhost:4000/uploads/cover/${book.folder}/${book.cover}`;

  return (
    <div className="granger__product-card">
      <div
        className="granger__product-card-image"
        style={{
          backgroundImage: `url('${URL_COVER}')`
        }}
      >
        <button
          className="granger__product-btn-fav"
          data-title="Añadir a favoritos"
        >
          <FontAwesomeIcon icon={faHeart} size="lg" />
        </button>
      </div>
      <div className="granger__product-card-details">
        <h1 className="has-text-weight-semibold">{book.title}</h1>

        <div className="granger__product-buy">
          <span>$100</span>
          <Link href={`/books/${book.uuid}`}>
            <a
              className="button is-small is-primary is-rounded is-fullwidth"
              id={`granger__product-btn-${book.uuid}`}
            >
              Ver más
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
