import { Request, Response } from "express";
import moment from "moment";

// Models
import Newsletter from "../models/newsletter.model";
import User from "../models/user.model";

// Interfaces
import INewsletter from "../interfaces/INewsletter";

// Libs
import msgResponse from "../utils/msgResponse";

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user: any = await User.findOne({
      _id: req.userId,
      email
    });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "newsletter/user-not-found",
        "User not found",
        "Usuario no encontrado",
        null
      );

    // If the email is already subscribed
    const newsletterExiste: any = await Newsletter.findOne({
      user_uuid: user.uuid,
      email: user.email
    });
    if (newsletterExiste)
      return msgResponse(
        res,
        400,
        "newsletter/error-already-subscribed",
        "Email is already subscribed",
        "El correo electrónico ya está suscrito",
        null
      );

    const newSubscription: INewsletter = new Newsletter({
      user_uuid: user.uuid,
      email: user.email,
      subscription_date: moment().toISOString()
    });

    await newSubscription.save();

    // Response catch error
    msgResponse(
      res,
      200,
      "newsletter/successfully-subscribed",
      "Successfully subscribed",
      "Suscrito con éxito",
      null
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "newsletter/subscription-failed",
      "Subscription failed",
      "Error al suscribir",
      null
    );
  }
};
