import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Libs
import msgResponse from "./msgResponse";

// Interface
import IPayloadJWT from "../interfaces/IPayloadJWT";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authorization");
  // Check if the token exists
  try {
    if (!token)
      return msgResponse(
        res,
        401,
        "auth/authentication-required",
        "Authentication required",
        "Autenticación requerida",
        null
      );

    // Check if the token is valid
    const payload = jwt.verify(
      token,
      process.env.SECRET || "test-token"
    ) as IPayloadJWT;

    req.userId = payload._id;
  } catch (error) {
    msgResponse(
      res,
      401,
      "auth/authentication-required",
      "Authentication required",
      "Autenticación requerida",
      null
    );
  }

  next();
};
