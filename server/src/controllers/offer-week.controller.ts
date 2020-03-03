import { Request, Response } from "express";
import moment from "moment";

// Models
import Offer from "../models/offer.model";
import Book from "../models/book.model";
import User from "../models/user.model";

// Interface
import IOffer from "../interfaces/IOffer";

// Libs
import msgResponse from "../utils/msgResponse";
import { getFirstDay, getLastDay } from "../utils/first-last-days-week";

export const getOffer = async (req: Request, res: Response) => {
  try {
    const firstDay = getFirstDay();
    const lastDay = getLastDay();

    const offer: any = await Offer.findOne({ firstDay, lastDay });

    // The book associated with this offer is searched
    const book: any = offer
      ? await Book.findOne({ uuid: offer.book_uuid })
      : null;

    // Response
    const offerResponse = offer
      ? {
          book: {
            uuid: book.uuid,
            authors: book.authors,
            cover: book.cover,
            genre: book.genre,
            pdf: book.pdf,
            price: book.price,
            title: book.title,
            description: book.description,
            slug: book.slug,
            yearPublication: book.yearPublication
          },
          offer
        }
      : null;

    // Response catch error
    msgResponse(
      res,
      200,
      "offer-week/get-successful",
      "Get successful",
      "Obtener exitoso",
      offerResponse
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "offer-week/not-loaded",
      "Offer of the week not charged",
      "Oferta de la semana no cargada",
      null
    );
  }
};

export const addOffer = async (req: Request, res: Response) => {
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

    const firstDay = getFirstDay();
    const lastDay = getLastDay();

    // If an offer already exists for this week, you cannot add another one, first delete the previous offer
    const OfferExist: any = await Offer.findOne({ firstDay, lastDay });
    if (OfferExist)
      return msgResponse(
        res,
        400,
        "offer-week/there-is-already-an-offer-for-this-week",
        "There is already an offer for this week",
        "Ya hay una oferta para esta semana",
        null
      );

    const { offer } = req.body;

    // It is verified that the offer has been sent
    if (!offer)
      return msgResponse(
        res,
        400,
        "offer-week/is-required",
        "The offer is required",
        "La oferta es obligatoria",
        null
      );

    // The percentage must be between 0 and 100
    if (offer.percentage <= 0 && offer.percentage >= 100)
      return msgResponse(
        res,
        400,
        "offer-week/wrong-percentage",
        "The percentage must be between 0 and 100",
        "El porcentaje debe estar entre 0 y 100",
        null
      );

    const book: any = await Book.findOne({ uuid: offer.book_uuid });
    // If the book does not exist
    if (!book)
      return msgResponse(
        res,
        400,
        "offer-week/book-not-found",
        "Book not found",
        "Libro no encontrado",
        null
      );

    // Creating new offer
    const newOffer: IOffer = new Offer({
      ...offer,
      newPrice: book.price - book.price * (offer.percentage / 100),
      firstDay,
      lastDay
    });
    // Saving offer created
    await newOffer.save();
    // Response
    msgResponse(
      res,
      201,
      "offer-week/successfully-added",
      "Offer of the week added successfully",
      "Oferta de la semana agregada exitosamente",
      null
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "offer-week/no-added",
      "Offer of the week not added",
      "Oferta de la semana no agregada",
      null
    );
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    // Verify that the user is an administrator, otherwise an error returns
    // const user: any = await User.findOne({ _id: req.userId });
    // if (!user.admin)
    //   return msgResponse(
    //     res,
    //     403,
    //     "auth/required-permissions",
    //     "You do not have permissions to perform this action",
    //     "No tienes permisos para realizar esta acción",
    //     null
    //   );
    // const id = req.params.id;
    // if (id.trim() == "")
    //   return msgResponse(
    //     res,
    //     400,
    //     "genre/genre-id-is-empty",
    //     "Genre id is empty",
    //     "El id del género está vacío",
    //     null
    //   );
    // await Genre.deleteOne({ _id: id })
    //   .then(resDelete => {
    //     console.log(resDelete);
    //     // Response
    //     msgResponse(
    //       res,
    //       201,
    //       "genre/successfully-removed",
    //       "Genre successfully removed",
    //       "Género eliminado con éxito",
    //       null
    //     );
    //   })
    //   .catch(err => {
    //     // Response catch error
    //     console.log(err);
    //     msgResponse(
    //       res,
    //       500,
    //       "genre/no-deleted",
    //       "Genre no deleted",
    //       "Género no eliminado",
    //       null
    //     );
    //   });
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "genre/no-deleted",
      "Genre no deleted",
      "Género no eliminado",
      null
    );
  }
};
