import React from "react";
import { useMediaQuery } from "react-responsive";

// React slick
import Slider from "react-slick";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";

// Components
import Hero from "./Hero";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      <Hero
        title="Tienda de libros"
        subtitle="Todo lo que estabas buscando"
        color="is-info"
      />
      <Hero
        title="Siempre pensando en ti"
        subtitle="Los mejores precios del mercado"
        color="is-danger"
      />
      <Hero
        title="Titulo de relleno"
        subtitle="Texto de relleno porque no tengo que poner"
        color="is-primary"
      />
    </Slider>
  );
};

export default Carousel;
