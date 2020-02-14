import React, { useState, useEffect } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

// React-carousel
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

// Components
import BookCard from "./BookCard";

const CarouselFeaturedBooks = ({ featuredBooks }) => {
  const [slidesPerPage, setSlidesPerPage] = useState(4);

  const slidesRezise = () => {
    if (window.innerWidth <= 600) {
      setSlidesPerPage(1);
    } else if (window.innerWidth <= 768) {
      setSlidesPerPage(2);
    } else if (window.innerWidth <= 1024) {
      setSlidesPerPage(3);
    } else if (window.innerWidth <= 1440) {
      setSlidesPerPage(4);
    } else {
      setSlidesPerPage(5);
    }
  };

  useEffect(() => {
    slidesRezise();
    window.addEventListener("resize", () => {
      slidesRezise();
    });
  }, []);

  const renderFeaturedBooks = () => {
    return featuredBooks.map(book => <BookCard book={book} key={book.uuid} />);
  };

  return (
    <div style={{ padding: "0 5%" }}>
      <Carousel
        infinite
        animationSpeed={1500}
        autoPlay={3000}
        slidesPerPage={slidesPerPage}
        keepDirectionWhenDragging
        arrows
        arrowLeft={
          <MdKeyboardArrowLeft
            size="36px"
            style={{ color: "#3f4d71", marginRight: "10px", cursor: "pointer" }}
          />
        }
        arrowRight={
          <MdKeyboardArrowRight
            size="36px"
            style={{ color: "#3f4d71", marginLeft: "10px", cursor: "pointer" }}
          />
        }
        addArrowClickHandler
      >
        {renderFeaturedBooks()}
      </Carousel>
    </div>
  );
};

export default CarouselFeaturedBooks;
