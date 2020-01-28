const response = (res, status, code, messageEn, messageEs, data = null) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");

  if (data == null) {
    res.end(
      JSON.stringify({
        code,
        message: {
          en: messageEn,
          es: messageEs
        }
      })
    );
  } else {
    res.end(
      JSON.stringify({
        code,
        message: {
          en: messageEn,
          es: messageEs
        },
        data
      })
    );
  }
};

export default response;
