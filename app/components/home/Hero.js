import React from "react";

const Hero = ({ title, subtitle, color }) => {
  return (
    <section className={`hero is-medium is-bold ${color}`}>
      <div className="hero-body">
        <div className="container">
          <h1 className="title">{title}</h1>
          <h2 className="subtitle">{subtitle}</h2>
        </div>
      </div>
    </section>
  );
};

export default Hero;
