import { Request, Response } from "express";

// Models
import Book from "../models/book.model";
import Genre from "../models/genre.model";

// Interface
import IBook from "../interfaces/IBook";

// Libs
import msgResponse from "../utils/msgResponse";
import paginateItems from "../utils/paginateItems";

export const search = async (req: Request, res: Response) => {
  try {
    const { search } = req.params;

    let searchWords: any = search.toUpperCase().split(" ");

    const books: any = await Book.find()
      .where("wordsTitle")
      .in(searchWords)
      .select({
        _id: 0,
        scores: 0,
        created_date: 0,
        uploadedBy: 0,
        wordsTitle: 0,
        __v: 0
      });

    const paginatedBooks = paginateItems(books, 12);

    return msgResponse(
      res,
      200,
      "books/searched-by-genre",
      "Books searched by genre",
      "Libros buscados por género",
      paginatedBooks
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

    const paginatedBooks = paginateItems(booksResponse, 12);

    return msgResponse(
      res,
      200,
      "books/searched-by-stars",
      "Books searched by stars",
      "Libros buscados por estrellas",
      paginatedBooks
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

    const books = await Book.find({ genre }).select({
      _id: 0,
      scores: 0,
      created_date: 0,
      uploadedBy: 0,
      wordsTitle: 0,
      __v: 0
    });

    const paginatedBooks = paginateItems(books, 12);

    return msgResponse(
      res,
      200,
      "books/searched-by-genre",
      "Books searched by genre",
      "Libros buscados por género",
      paginatedBooks
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
