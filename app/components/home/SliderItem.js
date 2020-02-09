import React from "react";

const Hero = ({ title, subtitle, img }) => {
  return (
    <>
      <section
        className="granger__slider-item"
        style={{ backgroundImage: `url('img/slider/${img}'` }}
      >
        <div className="granger__slider-item-gradient"></div>
        <div className="granger__slider-item-body">
          <div className="container">
            <h1 className="title">{title}</h1>
            <h2 className="subtitle">{subtitle}</h2>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
