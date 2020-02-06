import { Request, Response } from "express";
import uuid from "uuid";

// Models
import Book from "../models/book.model";

// Interface
import IBook from "../interfaces/IBook";

// Libs
import msgResponse from "../utils/msgResponse";

export const upload = async (req: Request, res: Response) => {
  try {
    // It is verified that there is at least one of the files, otherwise the req.files object will be null and will lead to an error
    if (!req.files)
      return msgResponse(
        res,
        400,
        "books/cover-pdf-is-required",
        "The cover of the book and the PDF file are required",
        "Se requiere la portada del libro y el archivo PDF",
        null
      );

    // Otherwise, the object req.files is not null, the respective value is assigned to the constants
    const cover: any = req.files!.cover;
    const pdf: any = req.files!.pdf;

    // It is verified that the cover of the book exists
    if (!cover)
      return msgResponse(
        res,
        400,
        "books/cover-is-required",
        "The book cover is required",
        "La portada del libro es obligatoria",
        null
      );

    // It is verified that the pdf file exists
    if (!pdf)
      return msgResponse(
        res,
        400,
        "books/pdf-is-required",
        "PDF file is required",
        "El archivo PDF es obligatorio",
        null
      );

    // It is verified that the cover format is JPG/JPEG/PNG
    if (cover.mimetype != "image/jpeg" && cover.mimetype != "image/png")
      return msgResponse(
        res,
        400,
        "books/cover-must-be-jpg-jpeg-png",
        "The cover must be in JPG/JPEG/PNG format",
        "La portada debe estar en formato JPG / JPEG / PNG",
        null
      );

    // It is verified that the format is PDF
    if (pdf.mimetype != "application/pdf")
      return msgResponse(
        res,
        400,
        "books/book-must-be-pdf",
        "The book must be in PDF format",
        "El libro debe estar en formato PDF",
        null
      );

    // Parsing book received
    const BookJSONReceived = JSON.parse(req.body.book);

    // Blank spaces are removed at the beginning and end of the title
    BookJSONReceived.title = BookJSONReceived.title.trim();

    // Now, it is verified that the fields are not empty
    if (BookJSONReceived.title == "")
      return msgResponse(
        res,
        400,
        "books/name-is-empty",
        "Name is empty",
        "Nombre se encuentra vacío",
        null
      );

    // It is verified that the price, quantity and year are numbers
    if (
      isNaN(BookJSONReceived.price) ||
      isNaN(BookJSONReceived.quantity) ||
      isNaN(BookJSONReceived.yearPublication)
    )
      return msgResponse(
        res,
        400,
        "books/price-quantity-year-must-be-numbers",
        "The price, quantity and year must be numbers",
        "El precio, la cantidad y el año deben ser números",
        null
      );

    // It is verified that the price and quantity are greater than zero
    if (
      parseFloat(BookJSONReceived.price) <= 0 ||
      parseFloat(BookJSONReceived.quantity) <= 0
    )
      return msgResponse(
        res,
        400,
        "books/price-quantity-greater-than-zero",
        "The price and quantity must be greater than zero",
        "Nombre se encuentra vacío",
        null
      );

    // It is verified that the year of publication is less than the current year
    if (
      parseFloat(BookJSONReceived.yearPublication) >= new Date().getFullYear()
    )
      return msgResponse(
        res,
        400,
        "books/year-publication-less-current-year",
        "The year of publication must be less than the current year",
        "El año de publicación debe ser inferior al año actual",
        null
      );

    // If both files exist proceed to prepare the saved in the database

    // After validating the data, if all is well, the strings are converted to numbers
    BookJSONReceived.price = parseFloat(BookJSONReceived.price);
    BookJSONReceived.quantity = parseFloat(BookJSONReceived.quantity);
    BookJSONReceived.yearPublication = parseFloat(
      BookJSONReceived.yearPublication
    );

    // Creating folder name
    const folder: string = BookJSONReceived.title
      .toLowerCase()
      .split(" ")
      .join("-");

    // Creating new book
    const datetime = new Date().getTime();
    const book: IBook = new Book({
      ...BookJSONReceived,
      uuid: uuid.v1(),
      folder: `${folder}-${datetime}`,
      cover: cover.name,
      pdf: pdf.name
    });

    // Saving new book
    const savedBook: IBook = await book.save();

    // Saving files on the server
    cover.mv(`./dist/uploads/cover/${book.folder}/${cover.name}`);
    pdf.mv(`./dist/uploads/pdf/${book.folder}/${pdf.name}`);

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

export const all = async (req: Request, res: Response) => {
  try {
    let books: any = await Book.find();
    // Values ​​that should not be sent are discarded
    books = books.map((book: IBook) => {
      return {
        uuid: book.uuid,
        authors: book.authors,
        cover: book.cover,
        folder: book.folder,
        genre: book.genre,
        pdf: book.pdf,
        price: book.price,
        quantity: book.quantity,
        title: book.title,
        stars: book.stars,
        yearPublication: book.yearPublication
      };
    });
    // Response catch error
    msgResponse(
      res,
      200,
      "books/get-all",
      "Get all the books",
      "Obtener todos los libros",
      books
    );
  } catch (err) {
    console.log(err);
    // Response catch error
    msgResponse(
      res,
      500,
      "books/error-loading",
      "Error loading books",
      "Error al cargar los libros",
      null
    );
  }
};
