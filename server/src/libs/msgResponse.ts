import { Response } from "express";

const msgResponse = (
  res: Response,
  status: number,
  code: string,
  messageEn: string,
  messageEs: string,
  data: any = null
) => {
  if (data === null) {
    res.status(status).json({
      code,
      message: {
        en: messageEn,
        es: messageEs
      }
    });
  } else {
    res.status(status).json({
      code,
      message: {
        en: messageEn,
        es: messageEs
      },
      data
    });
  }
};

export default msgResponse;
