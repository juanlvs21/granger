import React from "react";

const Loading = () => {
  return (
    <progress className="progress is-info" max="100">
      30%
    </progress>
  );
};

export default Loading;
