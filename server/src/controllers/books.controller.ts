import { Request, Response } from "express";
import slugify from "slugify";
import uuid from "uuid";

// Models
import Book from "../models/book.model";
import Genre from "../models/genre.mode";
import User from "../models/user.model";

// Interface
import IBook from "../interfaces/IBook";
import IGenre from "../interfaces/IGenre";

// Libs
import msgResponse from "../utils/msgResponse";

// Stripe
import Stripe from "stripe";
const stripe = new Stripe("sk_test_fZ0mAUSMmEmDgsCkApqTHyTo008t51Q0AL", {
  apiVersion: "2019-12-03"
});

// sendEmail
import { emailSendBook } from "../utils/email/sendEmail";
import sendBook from "../utils/email/templates/sendBook";

// Books
export const upload = async (req: Request, res: Response) => {
  try {
    // Parsing book received
    const BookJSONReceived = JSON.parse(req.body.book);

    const existBook = await Book.findOne({
      slug: slugify(BookJSONReceived.title)
    });

    // It is verified that the book does not exist(through the 'slug', that is to say that there are not two books with the same title)
    if (existBook) {
      msgResponse(
        res,
        400,
        "books/the-book-already-exists",
        "The book already exists",
        "El libro ya existe",
        null
      );
    } else {
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
      const datetime = new Date().getTime();
      const book: IBook = new Book({
        ...BookJSONReceived,
        uuid: uuid.v1(),
        slug: slugify(BookJSONReceived.title),
        cover: cover.name,
        pdf: pdf.name
      });

      // Saving new book
      const savedBook: IBook = await book.save();

      // Saving files on the server
      cover.mv(`./dist/uploads/cover/${book.slug}/${cover.name}`);
      pdf.mv(`./dist/uploads/pdf/${book.slug}/${pdf.name}`);

      // Response
      msgResponse(
        res,
        201,
        "books/saved-successfully",
        "Book saved successfully",
        "Libro guardado satisfactoriamente",
        savedBook.slug
      );
    }
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

export const paymentIntents = async (req: Request, res: Response) => {
  try {
    const { user_email, book_uuid } = req.body;

    const user: any = await User.findOne({ email: user_email });
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
      .then(async ({ receipt_email, status }) => {
        if (status == "succeeded") {
          const book = await Book.findOne({ uuid: book_uuid });
          const user = await User.findOne({ email: user_email });

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

          // Send registration email
          await emailSendBook(
            user.email,
            "Disfrute su nuevo libro📖",
            sendBook(user.firstName),
            {
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
            400,
            "books/requires-payment-method",
            "Requires payment method",
            "Requiere método de pago",
            null
          );
        }
      })
      .catch(err => {
        // Response catch error
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

export const getAll = async (req: Request, res: Response) => {
  try {
    let books: any = await Book.find();
    // Values ​​that should not be sent are discarded
    books = books.map((book: IBook) => {
      let totalStars: number = 0;

      if (book.scores.length > 0) {
        book.scores.map((score: any) => {
          totalStars = totalStars + score.star;
        });
      }

      return {
        uuid: book.uuid,
        authors: book.authors,
        cover: book.cover,
        genre: book.genre,
        pdf: book.pdf,
        price: book.price,
        title: book.title,
        description: book.description,
        slug: book.slug,
        stars: totalStars === 0 ? 0 : totalStars / book.scores.length,
        yearPublication: book.yearPublication
      };
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
      "books/error-to-buy",
      "Error buying the book",
      "Error al comprar el libro",
      null
    );
  }
};

export const getWithSlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    let book: any = await Book.findOne({ slug });

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

    let totalStars: number = 0;

    if (book.scores.length > 0) {
      book.scores.map((score: any) => {
        totalStars = totalStars + score.star;
      });
    }

    book = {
      uuid: book.uuid,
      authors: book.authors,
      cover: book.cover,
      genre: book.genre,
      pdf: book.pdf,
      price: book.price,
      title: book.title,
      description: book.description,
      slug: book.slug,
      stars: totalStars === 0 ? 0 : totalStars / book.scores.length,
      yearPublication: book.yearPublication
    };

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

// Search
export const searchStars = async (req: Request, res: Response) => {
  try {
    const { stars } = req.params;

    const books = await Book.find();

    let booksResponse: any[] = [];

    books.map((book: IBook) => {
      // The total amount of stars is taken and it divided between the number of times it was rated and thus, obtaining the average stars
      let totalStars: number = 0;

      if (book.scores.length > 0) {
        book.scores.map((score: any) => {
          totalStars = totalStars + score.star;
        });
      }

      const averageOfStar: any = totalStars / book.scores.length;

      // The decimals are ignored, taking into account only the whole number. To compare with the amount of stars requested
      if (parseInt(averageOfStar) === parseInt(stars)) {
        booksResponse.push({
          uuid: book.uuid,
          authors: book.authors,
          cover: book.cover,
          genre: book.genre,
          pdf: book.pdf,
          price: book.price,
          title: book.title,
          description: book.description,
          slug: book.slug,
          stars: totalStars === 0 ? 0 : totalStars / book.scores.length,
          yearPublication: book.yearPublication
        });
      }
    });

    return msgResponse(
      res,
      200,
      "books/searched-by-stars",
      "Books searched by stars",
      "Libros buscados por estrellas",
      booksResponse
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "books/error-by-performing-the-search",
      "Error by performing the search",
      "Error al realizar la búsqueda",
      null
    );
  }
};

export const searchGenre = async (req: Request, res: Response) => {
  try {
    const { genre } = req.params;

    const existGenre = await Genre.findOne({ genre });

    // If the user does not exist
    if (!existGenre)
      return msgResponse(
        res,
        400,
        "books/the-genre-searched-does-not-exist",
        "The genre searched does not exist",
        "El género buscado no existe",
        null
      );

    const books = await Book.find({ genre });

    return msgResponse(
      res,
      200,
      "books/searched-by-genre",
      "Books searched by genre",
      "Libros buscados por género",
      books
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "books/error-by-performing-the-search",
      "Error by performing the search",
      "Error al realizar la búsqueda",
      null
    );
  }
};

// Genres
export const getAllGenre = async (req: Request, res: Response) => {
  try {
    const genres: IGenre[] = await Genre.find();

    // Response catch error
    msgResponse(
      res,
      200,
      "genre/get-all",
      "Get all the genres",
      "Obtener todos los generos",
      genres
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "genre/not-loaded",
      "Genres not loaded",
      "Géneros no cargados",
      null
    );
  }
};

export const addGenre = async (req: Request, res: Response) => {
  try {
    const { genre } = req.body;

    // Creating new genre
    const newGenre: IGenre = new Genre({
      genre
    });

    // Saving genre created
    await newGenre.save();

    // Response
    msgResponse(
      res,
      201,
      "genre/successfully-added",
      "Genre successfully added",
      "Género agregado exitosamente",
      null
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "genre/no-added",
      "Genre no added",
      "Género no agregado",
      null
    );
  }
};
