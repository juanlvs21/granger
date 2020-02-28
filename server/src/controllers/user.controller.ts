import { Request, Response } from "express";

// Models
import User from "../models/user.model";
import Book from "../models/book.model";

// Interfaces
import IUser from "../interfaces/IUser";
import IBook from "interfaces/IBook";

// Libs
import msgResponse from "../utils/msgResponse";

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { user_uuid, book_uuid } = req.body;

    const user: any = await User.findOne({ uuid: user_uuid });
    const book: any = await Book.findOne({ uuid: book_uuid });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "user/not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    // If the book does not exist
    if (!book)
      return msgResponse(
        res,
        400,
        "user/book-not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    // Returns 1 if it exists in the favorites list and 0 if not
    const existFavorite = user.favorites.filter((favorite: IBook) =>
      favorite.uuid === book.uuid ? true : false
    ).length;
    // If it already exists in the favorites list it cannot be added again
    if (existFavorite)
      return msgResponse(
        res,
        400,
        "user/book-is-already-added-favorites",
        "Book is already added to favorites",
        "Libro ya está agregado a favoritos",
        null
      );

    user.favorites.push(book);

    await User.updateOne(
      { uuid: user.uuid },
      {
        uuid: user.uuid,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        created_date: user.created_date,
        admin: user.uuid,
        favorites: user.favorites
      }
    );

    // Response
    msgResponse(
      res,
      200,
      "user/book-added-favorites",
      "Book added to favorites",
      "Libro agregado a favoritos",
      null
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "user/error-adding-book-favorites",
      "Error adding book to favorites",
      "Error al agregar libro a favoritos",
      null
    );
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { user_uuid, book_uuid } = req.body;
    const user: any = await User.findOne({ uuid: user_uuid });
    const book: any = await Book.findOne({ uuid: book_uuid });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "user/not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    // If the book does not exist
    if (!book)
      return msgResponse(
        res,
        400,
        "user/book-not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    // Returns 1 if it exists in the favorites list and 0 if not
    const existFavorite = user.favorites.filter((favorite: IBook) =>
      favorite.uuid === book.uuid ? true : false
    ).length;
    // You cannot delete a book that is not in the list from favorites
    if (!existFavorite)
      return msgResponse(
        res,
        400,
        "user/favorite-book-not-found",
        "Favorite book not found",
        "Libro favorito no encontrado",
        null
      );

    const newFavorites = user.favorites.filter((favorite: IBook) => {
      return favorite.uuid != book.uuid;
    });

    await User.updateOne(
      { uuid: user.uuid },
      {
        uuid: user.uuid,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        created_date: user.created_date,
        admin: user.uuid,
        favorites: newFavorites
      }
    );

    // Response
    msgResponse(
      res,
      200,
      "user/book-added-favorites",
      "Book added to favorites",
      "Libro agregado a favoritos",
      null
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "user/error-adding-book-favorites",
      "Error adding book to favorites",
      "Error al agregar libro a favoritos",
      null
    );
  }
};
