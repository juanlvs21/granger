import jwt from "jsonwebtoken";

// Libs
import connectDb from "../../../server/dbMiddleware";
import response from "../../../server/utils/response";

// Models
import User from "../../../server/models/user.model";

const token = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { token } = req.body;

      const payload = await jwt.verify(
        token,
        process.env.SECRET || "test-token"
      );

      const user = await User.findOne({ _id: payload._id });

      // Creating jsonwebtoken
      const newToken = jwt.sign(
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
      response(
        res,
        200,
        "auth/sign-in-successfully",
        "Session successfully started",
        "Sesión iniciada correctamente",
        responseUser
      );
    } catch (err) {
      console.log(err);
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

export default connectDb(token);
