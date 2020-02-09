import Router from "next/router";

const redirect = (res, path) => {
  if (res) {
    res.writeHead(302, {
      Location: path
    });
    res.end();
    res.finished = true;
  } else {
    Router.push(path);
  }
};

export default redirect;
