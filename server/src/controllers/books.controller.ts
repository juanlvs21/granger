import { Request, Response } from "express";
import uuid from "uuid";

// Models
import Book from "../models/book.model";

// Interface
import IBook from "../interfaces/IBook";

// Libs
import msgResponse from "../utils/msgResponse";

export const uploadCover = async (req: Request, res: Response) => {
  try {
    const cover: any = req.files!.cover;
    const pdf: any = req.files!.pdf;

    // Parsing book received
    const BookJSONReceived = JSON.parse(req.body.book);

    // Creating folder name
    const folder: string = BookJSONReceived.title
      .toLowerCase()
      .split(" ")
      .join("-");

    // Creating new book
    const book: IBook = new Book({
      ...BookJSONReceived,
      uuid: uuid.v1(),
      folder: folder
    });

    // Saving new book
    const savedBook: IBook = await book.save();

    // Saving files on the server
    const datetime = new Date().getTime();
    cover.mv(`./dist/uploads/${folder}-${datetime}/cover/${cover.name}`);
    pdf.mv(`./dist/uploads/${folder}-${datetime}/pdf/${pdf.name}`);

    // Response
    msgResponse(
      res,
      201,
      "books/saved-successfully",
      "Book saved successfully",
      "Libro guardado satisfactoriamente",
      savedBook.uuid
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "books/unsaved",
      "Unsaved book, try again",
      "Libro no guardado, intente de nuevo",
      null
    );
  }
};
