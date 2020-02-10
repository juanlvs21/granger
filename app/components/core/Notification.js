import React from "react";

const Alert = ({ type, message, close }) => {
  return (
    <div className={`notification ${type}`}>
      <button className="delete" onClick={close}></button>
      {Array.isArray(message) ? (
        <ul>
          {message.map((msg, i) => (
            <li key={i}>- {msg.es}</li>
          ))}
        </ul>
      ) : (
        <span>{message}</span>
      )}
    </div>
  );
};

export default Alert;
