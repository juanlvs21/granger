import React from "react";

// React slick
import Slider from "react-slick";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";

// Components
import SliderTiem from "./SliderItem";

const SliderHome = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      <SliderTiem
        title="Tienda de libros"
        subtitle="Todo lo que estabas buscando"
        img="slider1.webp"
      />
      <SliderTiem
        title="Siempre pensando en ti"
        subtitle="Los mejores precios del mercado"
        img="slider2.webp"
      />
      <SliderTiem
        title="Titulo de relleno"
        subtitle="Texto de relleno porque no tengo que poner"
        img="slider3.webp"
      />
    </Slider>
  );
};

export default SliderHome;
