import React from "react";

const Alert = ({ type, message, close }) => {
  return (
    <div className={`notification ${type}`}>
      <button className="delete" onClick={close}></button>
      {message}
    </div>
  );
};

export default Alert;
