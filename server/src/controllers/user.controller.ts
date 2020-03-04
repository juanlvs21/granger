import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// Models
import User from "../models/user.model";
import Purchase from "../models/purchase.model";

// Libs
import msgResponse from "../utils/msgResponse";
import msgResponseValidatorInputs from "../utils/validate/user/responseValidateUser";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // The data is validated if they are correct
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (errors.array) return msgResponseValidatorInputs(res, errors.array());
    }

    const user: any = await User.findOne({ _id: req.userId });

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

    const { firstName, lastName, email } = req.body;

    await User.updateOne(
      { _id: user._id },
      {
        firstName,
        lastName,
        email
      }
    );

    // If the user changes the email, it is updated on purchases
    await Purchase.updateMany({ user_uuid: user.uuid }, { user_email: email });

    // The user is searched again to load the updated data
    const userUpdated: any = await User.findOne({ uuid: user.uuid });

    // Creating jsonwebtoken
    const token: string = jwt.sign(
      { _id: user._id },
      process.env.SECRET || "test-token"
    );

    // Creating response User
    const responseUser = {
      uuid: userUpdated.uuid,
      email: userUpdated.email,
      firstName: userUpdated.firstName,
      lastName: userUpdated.lastName,
      admin: userUpdated.admin,
      token
    };

    // Response
    msgResponse(
      res,
      201,
      "user/updated-successfully",
      "User updated successfully",
      "Usuario actualizado con éxito",
      responseUser
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "user/error-updating-user",
      "Error updating user",
      "Error al actualizar el usuario",
      null
    );
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const user: any = await User.findOne({ _id: req.userId });

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

    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword);
    console.log(newPassword);

    const correctPassword: boolean = await user.validatePassword(
      currentPassword
    );

    // If the password is incorrect
    if (!correctPassword)
      return msgResponse(
        res,
        400,
        "user/wrong-current-password",
        "Wrong current password",
        "Contraseña actual incorrecta",
        null
      );

    // Creating encrypted pasnewPasswordsword
    const password = await user.encryptPassword(newPassword);

    await User.updateOne(
      { _id: user._id },
      {
        password
      }
    );

    // Response
    msgResponse(
      res,
      201,
      "user/password-changed-successfully",
      "Password changed successfully",
      "Contraseña cambiada correctamente",
      null
    );
  } catch (err) {
    // Response catch error
    console.log(err);
    msgResponse(
      res,
      500,
      "user/error-changing-password",
      "Error changing password",
      "Error al cambiar la contraseña",
      null
    );
  }
};
