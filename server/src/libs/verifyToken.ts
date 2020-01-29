import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Libs
import msgResponse from "./msgResponse";

// Interface
interface IPayload {
  _id: string;
  iat: number;
  exp: number;
}

export const TokenValidation = (
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
    ) as IPayload;

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
