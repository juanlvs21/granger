import { Request, Response } from "express";
import path from "path";
import fs from "fs-extra";
import slugify from "slugify";
import uuid from "uuid";
import moment from "moment";

// Models
import Book from "../models/book.model";
import User from "../models/user.model";
import Favorite from "../models/favorites.model";
import Purchase from "../models/purchase.model";
import Offer from "../models/offer.model";

// Interface
import IBook from "../interfaces/IBook";
import IPurchase from "../interfaces/IPurchase";

// Libs
import msgResponse from "../utils/msgResponse";
import paginateItems from "../utils/paginateItems";

// Stripe
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SK || "", {
  apiVersion: "2019-12-03"
});

// sendEmail
import { emailSendBook, emailDeleteBook } from "../utils/email/sendEmail";
import sendBook from "../utils/email/templates/sendBook";
import deleteBookTemplate from "../utils/email/templates/deleteBook";

export const upload = async (req: Request, res: Response) => {
  try {
    // Verify that the user is an administrator, otherwise an error returns
    const user: any = await User.findOne({ _id: req.userId });
    if (!user.admin)
      return msgResponse(
        res,
        403,
        "auth/required-permissions",
        "You do not have permissions to perform this action",
        "No tienes permisos para realizar esta acción",
        null
      );

    // Parsing book received
    const BookJSONReceived = JSON.parse(req.body.book);

    const existBook = await Book.findOne({
      slug: slugify(BookJSONReceived.title)
    });

    // It is verified that the book does not exist(through the 'slug', that is to say that there are not two books with the same title)
    if (existBook)
      return msgResponse(
        res,
        400,
        "books/the-book-already-exists",
        "The book already exists",
        "El libro ya existe",
        null
      );
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

    // Blank spaces are removed at the beginning and end of the title
    BookJSONReceived.title = BookJSONReceived.title.trim();

    // Now, it is verified that the fields are not empty
    if (BookJSONReceived.title == "")
      return msgResponse(
        res,
        400,
        "books/title-is-empty",
        "Title is empty",
        "Titulo se encuentra vacío",
        null
      );

    // It is verified that the price, quantity and year are numbers
    if (
      isNaN(BookJSONReceived.price) ||
      isNaN(BookJSONReceived.yearPublication)
    )
      return msgResponse(
        res,
        400,
        "books/price-year-must-be-numbers",
        "The price and year must be numbers",
        "El precio y el año deben ser números",
        null
      );

    // It is verified that the price and quantity are greater than zero
    if (parseFloat(BookJSONReceived.price) <= 0)
      return msgResponse(
        res,
        400,
        "books/price-greater-than-zero",
        "The price must be greater than zero",
        "El precio debe ser mayor que cero",
        null
      );

    // It is verified that the year of publication is less than the current year
    if (
      BookJSONReceived.yearPublication &&
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
    BookJSONReceived.yearPublication = BookJSONReceived.yearPublication
      ? parseFloat(BookJSONReceived.yearPublication)
      : 0;

    // Creating new book
    const book: IBook = new Book({
      ...BookJSONReceived,
      uuid: uuid.v1(),
      slug: slugify(BookJSONReceived.title),
      wordsTitle: BookJSONReceived.title.toUpperCase().split(" "),
      created_date: moment().toISOString(),
      cover: cover.name,
      pdf: pdf.name,
      uploadedBy: user.uuid
    });

    // Saving new book
    const savedBook: IBook = await book.save();

    // Saving files on the server
    cover.mv(`./dist/uploads/cover/${book.uuid}/${cover.name}`);
    pdf.mv(`./dist/uploads/pdf/${book.uuid}/${pdf.name}`);

    // Response
    msgResponse(
      res,
      201,
      "books/saved-successfully",
      "Book saved successfully",
      "Libro guardado satisfactoriamente",
      savedBook.slug
    );
  } catch (err) {
    // Response catch
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

export const deleteBook = async (req: Request, res: Response) => {
  try {
    // Verify that the user is an administrator, otherwise an error returns
    const user: any = await User.findOne({ _id: req.userId });
    if (!user.admin)
      return msgResponse(
        res,
        403,
        "auth/required-permissions",
        "You do not have permissions to perform this action",
        "No tienes permisos para realizar esta acción",
        null
      );

    const uuid = req.params.uuid;

    if (uuid.trim() == "")
      return msgResponse(
        res,
        400,
        "book/uuid-is-empty",
        "Book uuid is empty",
        "El uuid del género está vacío",
        null
      );

    const book: any = await Book.findOne({ uuid });

    // If the book does not exist
    if (!book)
      return msgResponse(
        res,
        400,
        "books/not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    await Book.deleteOne({ uuid });
    // The book is also removed from favorites
    await Favorite.deleteMany({ book_uuid: uuid });
    // If the book is on offers it is also removed from that collection
    await Offer.deleteMany({ book_uuid: uuid });

    // The book is deleted from purchases since the file will not exist Before deleting the book an email is sent to all users who have purchased it, additionally they are sent the file so they can save it
    let purchases: any = await Purchase.find({ book_uuid: book.uuid });
    purchases = purchases.map((purchase: IPurchase) => {
      return purchase.user_email;
    });
    if (purchases.length) {
      await emailDeleteBook(
        purchases,
        "¡Comunicado importante!",
        deleteBookTemplate(),
        {
          title: book.title,
          slug: book.slug,
          uuid: book.uuid,
          pdf: book.pdf
        }
      );
      await Purchase.deleteMany({ book_uuid: book.uuid });
    }

    // Files related to the book are deleted
    fs.removeSync(path.resolve(__dirname, "../", `uploads/cover/${book.uuid}`));
    fs.removeSync(path.resolve(__dirname, "../", `uploads/pdf/${book.uuid}`));

    // Response
    msgResponse(
      res,
      201,
      "books/successfully-removed",
      "Book successfully removed",
      "Libro eliminado con éxito",
      null
    );
  } catch (err) {
    // Response catch
    console.log(err);
    msgResponse(
      res,
      500,
      "books/not-deleted",
      "Book not deleted",
      "Libro no eliminado",
      null
    );
  }
};

export const paymentIntents = async (req: Request, res: Response) => {
  try {
    const { user_email, book_uuid } = req.body;

    const user: any = await User.findOne({
      email: user_email,
      _id: req.userId
    });
    const book: any = await Book.findOne({ uuid: book_uuid });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "books/user-not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    // If the book does not exist
    if (!book)
      return msgResponse(
        res,
        400,
        "books/not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    await stripe.paymentIntents
      .create({
        payment_method_types: ["card"],
        amount: book.price * 100,
        currency: "usd",
        receipt_email: user.email,
        customer: user.customer_id,
        description: `Purchase of the book: ${book.title}`
      })
      .then(({ id, client_secret }) => {
        // Response
        msgResponse(
          res,
          200,
          "books/paymentintent-successful",
          "Paymentintent successful",
          "Pago exitoso",
          { id, client_secret }
        );
      })
      .catch(err => {
        // Response catch error
        msgResponse(
          res,
          400,
          "books/error-process-payment",
          "Error trying to process payment",
          "Error al intentar procesar el pago",
          null
        );
      });
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "books/error-process-payment",
      "Error trying to process payment",
      "Error al intentar procesar el pago",
      null
    );
  }
};

export const paymentSucceeded = async (req: Request, res: Response) => {
  try {
    const { payment_intents, book_uuid, user_email } = req.body;

    await stripe.paymentIntents
      .retrieve(payment_intents)
      .then(async ({ id, receipt_email, status }) => {
        if (status == "succeeded") {
          const book: any = await Book.findOne({ uuid: book_uuid });
          const user: any = await User.findOne({
            email: user_email,
            _id: req.userId
          });

          // If the user does not exist
          if (!user)
            return msgResponse(
              res,
              400,
              "books/user-not-found",
              "User not found",
              "Usuario no encontrado",
              null
            );

          // If the book does not exist
          if (!book)
            return msgResponse(
              res,
              400,
              "books/not-found",
              "Book not found",
              "Libro no encontrado",
              null
            );

          // A record of purchases made is created
          const purchase: IPurchase = new Purchase({
            uuid: uuid.v1(),
            user_uuid: user.uuid,
            user_email: user.email,
            book_uuid: book.uuid,
            payments_id: id,
            book: {
              title: book.title,
              authors: book.authors,
              slug: book.slug,
              pdf: book.pdf
            },
            date_purchase: moment().toISOString()
          });

          await purchase.save();

          // Send book email
          await emailSendBook(
            user.email,
            "Disfrute su nuevo libro📖",
            sendBook(user.firstName),
            {
              uuid: book.uuid,
              title: book.title,
              slug: book.slug,
              pdf: book.pdf
            }
          )
            .then(res => {
              console.log("Book - Email Send");
            })
            .catch(err => {
              msgResponse(
                res,
                500,
                "books/error-sending-book",
                "Error sending book",
                "Error al enviar el libro",
                null
              );
            });

          // Response
          msgResponse(
            res,
            200,
            "books/paymentintent-successful",
            "Paymentintent successful",
            "Pago exitoso",
            null
          );
        } else {
          msgResponse(
            res,
            402,
            "books/requires-payment-method",
            "Requires payment method",
            "Requiere método de pago",
            null
          );
        }
      })
      .catch(err => {
        // Response catch error
        console.log(err);
        msgResponse(
          res,
          400,
          "books/paymentintent-not-found",
          "Paymentintent not found",
          "Pago no encontrado",
          null
        );
      });
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "books/error-sending-book",
      "Error sending book",
      "Error al enviar el libro",
      null
    );
  }
};

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const user: any = await User.findOne({ _id: req.userId });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "purchase/user-not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    const purchases: IPurchase[] = await Purchase.find({
      user_uuid: user.uuid
    });

    const response = purchases.map((purchase: any) => {
      return {
        uuid: purchase.uuid,
        date_purchase: purchase.date_purchase,
        title: purchase.book.title,
        authors: purchase.book.authors,
        slug: purchase.book.slug
      };
    });

    // Response
    msgResponse(
      res,
      200,
      "purchase/get-purchases",
      "Get the purchases",
      "Obtener las compras",
      response
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "purchase/error-getting",
      "Error getting purchases",
      "Error al obtener las compras",
      null
    );
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const books: any = await Book.find().select({
      _id: 0,
      scores: 0,
      created_date: 0,
      uploadedBy: 0,
      wordsTitle: 0,
      __v: 0
    });

    const paginatedBooks = paginateItems(books, 12);

    // Response
    msgResponse(
      res,
      200,
      "books/get-all",
      "Get all the books",
      "Obtener todos los libros",
      paginatedBooks
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "books/error-getting-all",
      "Error getting all books",
      "Error al obtener todos los libros",
      null
    );
  }
};

export const getAllNoPagination = async (req: Request, res: Response) => {
  try {
    const books: any = await Book.find().select({
      _id: 0,
      scores: 0,
      created_date: 0,
      uploadedBy: 0,
      wordsTitle: 0,
      __v: 0
    });

    // Response
    msgResponse(
      res,
      200,
      "books/get-all",
      "Get all the books",
      "Obtener todos los libros",
      books
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "books/error-getting-all",
      "Error getting all books",
      "Error al obtener todos los libros",
      null
    );
  }
};

export const getRecent = async (req: Request, res: Response) => {
  try {
    const books: any = await Book.find()
      .sort({ _id: -1 })
      .limit(5)
      .select({
        _id: 0,
        scores: 0,
        created_date: 0,
        uploadedBy: 0,
        wordsTitle: 0,
        __v: 0
      });

    // Response
    msgResponse(
      res,
      200,
      "books/get-recent",
      "Get recent books",
      "Obtener libros recientes",
      books
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "books/error-getting-recent",
      "Error getting recent books",
      "Error al obtener los libros recientes",
      null
    );
  }
};

export const getWithSlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    let book: any = await Book.findOne({ slug }).select({
      _id: 0,
      scores: 0,
      created_date: 0,
      uploadedBy: 0,
      wordsTitle: 0,
      __v: 0
    });

    // It is verified that the book exists
    if (!book)
      return msgResponse(
        res,
        400,
        "books/does-not-exist",
        "The book does not exist",
        "El libro no existe",
        null
      );

    // Response
    msgResponse(
      res,
      200,
      "books/get-with-slug",
      "Get a book using the slug",
      "Conseguir un libro usando el slug",
      book
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "books/error-loading",
      "Error loading the book",
      "Error al cargar el libro",
      null
    );
  }
};

export const resendBook = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.body;

    const user: any = await User.findOne({ _id: req.userId });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "purchase/user-not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    const purchase: any = await Purchase.findOne({ uuid });

    // If the purchase does not exist
    if (!purchase)
      return msgResponse(
        res,
        400,
        "book/purchase-not-found",
        "Purchase not found",
        "Compra no encontrada",
        null
      );

    const book: any = await Book.findOne({ uuid: purchase.book_uuid });

    // If the book does not exist
    if (!book)
      return msgResponse(
        res,
        400,
        "book/not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    // Send book email
    await emailSendBook(
      user.email,
      "Disfrute su nuevo libro📖",
      sendBook(user.firstName),
      {
        uuid: book.uuid,
        title: book.title,
        slug: book.slug,
        pdf: book.pdf
      }
    )
      .then(res => {
        console.log("Book - Email Send");
      })
      .catch(err => {
        msgResponse(
          res,
          500,
          "books/error-sending-book",
          "Error sending book",
          "Error al enviar el libro",
          null
        );
      });

    // Response
    msgResponse(
      res,
      200,
      "books/sent-successfully",
      "Book sent successfully",
      "Libro enviado exitosamente",
      null
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "books/error-resending-book",
      "Error resending book",
      "Error al reenviar el libro",
      null
    );
  }
};

export const updateInfoBook = async (req: Request, res: Response) => {
  try {
    // Verify that the user is an administrator, otherwise an error returns
    const user: any = await User.findOne({ _id: req.userId });
    if (!user.admin)
      return msgResponse(
        res,
        403,
        "auth/required-permissions",
        "You do not have permissions to perform this action",
        "No tienes permisos para realizar esta acción",
        null
      );

    // Parsing book received
    const { book } = req.body;

    const existBook = await Book.findOne({ uuid: book.uuid });

    // It is verified that the book does not exist(through the 'slug', that is to say that there are not two books with the same title)
    if (!existBook)
      return msgResponse(
        res,
        400,
        "book/not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    // Blank spaces are removed at the beginning and end of the title
    book.title = book.title.trim();

    // Now, it is verified that the fields are not empty
    if (book.title == "")
      return msgResponse(
        res,
        400,
        "books/title-is-empty",
        "Title is empty",
        "Titulo se encuentra vacío",
        null
      );

    // It is verified that the price, quantity and year are numbers
    if (isNaN(book.price) || isNaN(book.yearPublication))
      return msgResponse(
        res,
        400,
        "books/price-year-must-be-numbers",
        "The price and year must be numbers",
        "El precio y el año deben ser números",
        null
      );

    // It is verified that the price and quantity are greater than zero
    if (parseFloat(book.price) <= 0)
      return msgResponse(
        res,
        400,
        "books/price-greater-than-zero",
        "The price must be greater than zero",
        "El precio debe ser mayor que cero",
        null
      );

    // It is verified that the year of publication is less than the current year
    if (
      book.yearPublication &&
      parseFloat(book.yearPublication) >= new Date().getFullYear()
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
    book.price = parseFloat(book.price);
    book.yearPublication = book.yearPublication
      ? parseFloat(book.yearPublication)
      : 0;

    // Creating new book
    await Book.updateOne(
      { uuid: book.uuid },
      {
        ...book,
        slug: slugify(book.title)
      }
    );

    // Response
    msgResponse(
      res,
      201,
      "books/saved-successfully",
      "Book saved successfully",
      "Libro guardado satisfactoriamente",
      slugify(book.title)
    );
  } catch (err) {
    // Response catch
    msgResponse(
      res,
      500,
      "books/not-updated",
      "Book not updated",
      "Libro no actualizado",
      null
    );
  }
};

export const updateFilesBook = async (req: Request, res: Response) => {
  try {
    // Verify that the user is an administrator, otherwise an error returns
    const user: any = await User.findOne({ _id: req.userId });
    if (!user.admin)
      return msgResponse(
        res,
        403,
        "auth/required-permissions",
        "You do not have permissions to perform this action",
        "No tienes permisos para realizar esta acción",
        null
      );

    const uuid = req.params.uuid;

    const book = await Book.findOne({ uuid });

    // It is verified that the book does not exist(through the 'slug', that is to say that there are not two books with the same title)
    if (!book)
      return msgResponse(
        res,
        400,
        "books/not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

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

    // The book is updated with the new files
    await Book.updateOne(
      { uuid: book.uuid },
      {
        cover: cover.name,
        pdf: pdf.name
      }
    );

    // Previous files are deleted
    fs.removeSync(path.resolve(__dirname, "../", `uploads/cover/${book.uuid}`));
    fs.removeSync(path.resolve(__dirname, "../", `uploads/pdf/${book.uuid}`));

    // Saving files on the server
    cover.mv(`./dist/uploads/cover/${book.uuid}/${cover.name}`);
    pdf.mv(`./dist/uploads/pdf/${book.uuid}/${pdf.name}`);

    // Response
    msgResponse(
      res,
      201,
      "books/saved-successfully",
      "Book saved successfully",
      "Libro guardado satisfactoriamente",
      null
    );
  } catch (err) {
    // Response catch
    console.log(err);
    msgResponse(
      res,
      500,
      "books/files-not-updated",
      "Book files not updated",
      "Archivos del libro no actualizados",
      null
    );
  }
};
