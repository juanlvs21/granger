import { Request, Response } from "express";
import { validationResult } from "express-validator";
import uuid from "uuid";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

// Models
import User from "../models/user.model";

// Interfaces
import IUser from "../interfaces/IUser";
import IPayloadJWT from "../interfaces/IPayloadJWT";

// Libs
import msgResponse from "../utils/msgResponse";
import msgResponseValidatorInputs from "../utils/validate/user/responseValidateUser";

// sendEmail
import { emailSignup } from "../utils/email/sendEmail";
import welcomeTemplate from "../utils/email/templates/welcome";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // The data is validated if they are correct
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (errors.array) return msgResponseValidatorInputs(res, errors.array());
    }

    // Search user by email
    const userExists = await User.findOne({ email });

    // Email already registered
    if (userExists)
      return msgResponse(
        res,
        400,
        "auth/user-exists",
        "Email already registered",
        "Correo electrónico ya registrado",
        null
      );

    // Creating new Customer
    const stripe = new Stripe("sk_test_fZ0mAUSMmEmDgsCkApqTHyTo008t51Q0AL", {
      apiVersion: "2019-12-03"
    });

    const customer: Stripe.Customer = await stripe.customers.create({
      email: email,
      name: `${firstName} ${lastName}`
    });

    // Creating new user
    const user: IUser = new User({
      uuid: uuid.v1(),
      customer_id: customer.id,
      email,
      password,
      firstName,
      lastName
    });

    // Creating encrypted password
    user.password = await user.encryptPassword(user.password);

    // Saving user created
    const savedUser: IUser = await user.save();

    // Creating jsonwebtoken
    const token: string = jwt.sign(
      { _id: user._id },
      process.env.SECRET || "test-token"
    );

    // Creating response User
    const responseUser = {
      uuid: savedUser.uuid,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      admin: savedUser.admin,
      created_date: savedUser.created_date,
      token
    };

    // Send registration email
    await emailSignup(
      savedUser.email,
      "Registro exitoso✔",
      welcomeTemplate(savedUser.firstName)
    )
      .then(res => {
        console.log("Email Send");
        console.log(res);
      })
      .catch(err => {
        console.log("Error: ", err);
      });

    // Response
    msgResponse(
      res,
      201,
      "auth/sign-up-succesfully",
      "User successfully registered",
      "Usuario registrado satisfactoriamente",
      responseUser
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "auth/user-unregistered",
      "Unregistered user, try again",
      "Usuario no registrado, intente de nuevo",
      null
    );
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (errors.array) return msgResponseValidatorInputs(res, errors.array());
    }

    const user = await User.findOne({ email });

    // If the user does not exist
    if (!user)
      return msgResponse(
        res,
        400,
        "auth/wrong-email-or-password",
        "Wrong email or password",
        "Correo o contraseña equivocada",
        null
      );

    const correctPassword: boolean = await user.validatePassword(password);

    // If the password is incorrect
    if (!correctPassword)
      return msgResponse(
        res,
        400,
        "auth/wrong-email-or-password",
        "Wrong email or password",
        "Correo o contraseña equivocada",
        null
      );

    // The same message is placed if the user does not exist or if the password is incorrect since specifying the input problem can cause security problems

    // Creating jsonwebtoken
    const token: string = jwt.sign(
      { _id: user._id },
      process.env.SECRET || "test-token"
    );

    // Creating response User
    const responseUser = {
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin,
      created_date: user.created_date,
      token
    };

    // Response
    msgResponse(
      res,
      200,
      "auth/sign-in-successfully",
      "Session successfully started",
      "Sesión iniciada correctamente",
      responseUser
    );
  } catch (err) {
    console.log(err);
    // Response catch error
    msgResponse(
      res,
      500,
      "auth/user-unregistered",
      "Unregistered user, try again",
      "Usuario no registrado, intente de nuevo",
      null
    );
  }
};

export const token = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(
      token,
      process.env.SECRET || "test-token"
    ) as IPayloadJWT;

    const user: any = await User.findOne({ _id: payload._id });

    // Creating jsonwebtoken
    const newToken: string = jwt.sign(
      { _id: user._id },
      process.env.SECRET || "test-token"
    );

    // Creating response User
    const responseUser = {
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin,
      created_date: user.created_date,
      token: newToken
    };

    // Response
    msgResponse(
      res,
      200,
      "auth/sign-in-successfully",
      "Session successfully started",
      "Sesión iniciada correctamente",
      responseUser
    );
  } catch (err) {
    // Response catch error
    msgResponse(
      res,
      500,
      "auth/user-unregistered",
      "Unregistered user, try again",
      "Usuario no registrado, intente de nuevo",
      null
    );
  }
};
