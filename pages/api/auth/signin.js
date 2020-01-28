import jwt from "jsonwebtoken";

// Libs
import connectDb from "../../../server/dbMiddleware";
import response from "../../../server/utils/response";

// Models
import User from "../../../server/models/user.model";

const signup = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      // If the user does not exist
      if (!user)
        return response(
          res,
          200,
          "auth/Wrong-email-or-password",
          "Wrong email or password",
          "Correo o contraseña equivocada",
          null
        );

      const correctPassword = await user.validatePassword(
        password,
        user.password
      );

      // If the password is incorrect
      if (!correctPassword)
        return response(
          res,
          200,
          "auth/Wrong-email-or-password",
          "Wrong email or password",
          "Correo o contraseña equivocada",
          null
        );

      // The same message is placed if the user does not exist or if the password is incorrect since specifying the input problem can cause security problems

      // Creating jsonwebtoken
      const token = jwt.sign(
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
      response(
        res,
        200,
        "auth/sign-in-successfully",
        "Session successfully started",
        "Sesión iniciada correctamente",
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
