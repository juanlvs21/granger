import { Request, Response } from "express";

// Models
import User from "../models/user.model";
import Book from "../models/book.model";
import Favorite from "../models/favorites.model";

// Interfaces
import IFavorite from "interfaces/IFavorite";

// Libs
import msgResponse from "../utils/msgResponse";

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const user: any = await User.findOne({ _id: req.userId });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "favorites/user-not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    // Favorites list
    const favoritesList: any = await Favorite.find({ user_uuid: user.uuid });

    // Response
    msgResponse(
      res,
      200,
      "favorites/favorites-list-obtained",
      "Favorites list obtained",
      "Lista de favoritos obtenida",
      favoritesList
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "favorites/failed-get",
      "Failed to get favorites",
      "Error al obtener favoritos",
      null
    );
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { book_uuid } = req.body;
    const user: any = await User.findOne({ _id: req.userId });
    const book: any = await Book.findOne({ uuid: book_uuid });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "favorites/user-not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    // If the book does not exist
    if (!book)
      return msgResponse(
        res,
        400,
        "favorites/book-not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    const existFavorite: any = await Favorite.findOne({
      user_uuid: user.uuid,
      book_uuid: book.uuid
    });
    // If it already exists in the favorites list it cannot be added again
    if (existFavorite)
      return msgResponse(
        res,
        400,
        "favorites/book-is-already-added-favorites",
        "Book is already added to favorites",
        "Libro ya está agregado a favoritos",
        null
      );

    const newFavorite: IFavorite = new Favorite({
      user_uuid: user.uuid,
      book_uuid: book.uuid,
      book: {
        price: book.price,
        authors: book.authors,
        description: book.description,
        available: book.available,
        genre: book.genre,
        title: book.title,
        slug: book.slug,
        yearPublication: book.yearPublication
      }
    });

    // Saving favorite added
    await newFavorite.save();

    // Favorite List Response
    const favoritesList: any = await Favorite.find({ user_uuid: user.uuid });

    // Response
    msgResponse(
      res,
      200,
      "favorites/book-added-favorites",
      "Book added to favorites",
      "Libro agregado a favoritos",
      favoritesList
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "favorites/error-adding-book-favorites",
      "Error adding book to favorites",
      "Error al agregar libro a favoritos",
      null
    );
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { book_uuid } = req.body;
    const user: any = await User.findOne({ _id: req.userId });
    const book: any = await Book.findOne({ uuid: book_uuid });
    const favorites: any = await Favorite.find({
      user_uuid: user.uuid,
      book_uuid: book.uuid
    });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "favorites/user-not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    // If the book does not exist
    if (!book)
      return msgResponse(
        res,
        400,
        "favorites/book-not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    // You cannot delete a book that is not in the list from favorites
    if (!favorites)
      return msgResponse(
        res,
        400,
        "favorites/favorite-book-not-found",
        "Favorite book not found",
        "Libro favorito no encontrado",
        null
      );

    // Delete favorite
    await Favorite.deleteOne({ user_uuid: user.uuid, book_uuid: book.uuid });

    // Favorites list
    const favoritesList: any = await Favorite.find({ user_uuid: user.uuid });

    // Response
    msgResponse(
      res,
      200,
      "favorites/book-added-favorites",
      "Book added to favorites",
      "Libro agregado a favoritos",
      favoritesList
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "favorites/error-adding-book-favorites",
      "Error adding book to favorites",
      "Error al agregar libro a favoritos",
      null
    );
  }
};
