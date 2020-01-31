import { Request, Response } from "express";
import uuid from "uuid";

// Models
import Book, { IBook } from "../models/book.model";

// Libs
import msgResponse from "../libs/msgResponse";

export const upload = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "auth/user-unregistered",
      "Unregistered user, try again",
      "Usuario no registrado, intente de nuevo",
      null
    );
  }
};
