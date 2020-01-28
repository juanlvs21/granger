import uuid from "uuid";
import jwt from "jsonwebtoken";

// Libs
import connectDb from "../../../server/dbMiddleware";
import response from "../../../server/utils/response";

// Models
import User from "../../../server/models/user.model";

const signup = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Search user by email
      const userExists = await User.findOne({ email });

      // Email already registered
      if (userExists)
        return response(
          res,
          200,
          "auth/user-exists",
          "Email already registered",
          "Correo electrónico ya registrado",
          null
        );

      // Creating new user
      const user = new User({
        uuid: uuid.v1(),
        email,
        password,
        firstName,
        lastName
      });

      // Creating encrypted password
      user.password = await user.encryptPassword(user.password);

      // Saving user created
      const savedUser = await user.save();

      // Creating jsonwebtoken
      const token = jwt.sign(
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

      // Response
      response(
        res,
        201,
        "auth/sign-up-succesfully",
        "User successfully registered",
        "Usuario registrado satisfactoriamente",
        responseUser
      );
    } catch (err) {
      response(
        res,
        500,
        "error/internal-server-error",
        "Internal Server Error",
        "Error Interno del Servidor",
        null
      );
    }
  } else {
    response(
      res,
      404,
      "error/not-found",
      "Not Found",
      "Recurso no Encontrado",
      null
    );
  }
};

export default connectDb(signup);
