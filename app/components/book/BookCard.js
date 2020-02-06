import React, { useState } from "react";

// Font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const BookCard = ({ book }) => {
  return (
    <div className="granger__product-card">
      <div
        className="granger__product-card-image"
        style={{
          backgroundImage: `url('http://localhost:4000/uploads/cover/${book.folder}/${book.cover}')`
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
          <button
            className="button is-small is-primary is-rounded is-fullwidth"
            id={`granger__product-btn-${book.id}`}
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
