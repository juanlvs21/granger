import React, { useState } from "react";

// Font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const BookCard = props => {
  return (
    <div className="book__product-card">
      <div
        className="book__product-card-image"
        style={{ backgroundImage: `url('${props.book.img}')` }}
      >
        <button
          className="book__product-btn-fav"
          data-title="Añadir a favoritos"
        >
          <FontAwesomeIcon icon={faHeart} size="lg" />
        </button>
      </div>
      <div className="book__product-card-details">
        <h1 className="has-text-weight-semibold">{props.book.title}</h1>

        <div className="book__product-buy">
          <span>$100</span>
          <button
            className="button is-small is-primary is-rounded is-fullwidth"
            id={`book__product-btn-${props.book.id}`}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
