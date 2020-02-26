import { Request, Response } from "express";

// Models
import Genre from "../models/genre.mode";

// Interface
import IGenre from "../interfaces/IGenre";

// Libs
import msgResponse from "../utils/msgResponse";

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
    console.log(req.userId);
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

export const updateGenre = async (req: Request, res: Response) => {
  try {
    const { _id, genre } = req.body;

    const existGenre = await Genre.findOne({ _id });

    // If the genre does not exist
    if (!existGenre)
      return msgResponse(
        res,
        400,
        "genre/not-found",
        "Genre not found",
        "Género no encontrado",
        null
      );

    const updatedGenre: IGenre = await Genre.updateOne({ _id }, { genre });

    msgResponse(
      res,
      200,
      "genre/successfully-updated",
      "Genre successfully updated",
      "Género actualizado correctamente",
      null
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "genre/not-updated",
      "Genre not updated",
      "Género no actualizado",
      null
    );
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (id.trim() == "")
      return msgResponse(
        res,
        400,
        "genre/genre-id-is-empty",
        "Genre id is empty",
        "El id del género está vacío",
        null
      );

    await Genre.deleteOne({ _id: id })
      .then(resDelete => {
        console.log(resDelete);
        // Response
        msgResponse(
          res,
          201,
          "genre/successfully-removed",
          "Genre successfully removed",
          "Género eliminado con éxito",
          null
        );
      })
      .catch(err => {
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
      });
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
