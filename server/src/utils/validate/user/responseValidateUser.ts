import { Response } from "express";

// Libs
import msgResponse from "../../msgResponse";

const responseValidateUser = (res: Response, errors: any = null) => {
  let listError: any = [];

  errors.map((err: any) => {
    if (err.param === "email") {
      listError.push({
        en: "Enter a valid email",
        es: "Ingrese un correo electrónico válido"
      });
    } else if (err.param === "password") {
      listError.push({
        en: "Enter a valid password (Greater than 6 characters)",
        es: "Ingrese una contraseña válida (más de 6 caracteres)"
      });
    } else if (err.param === "firstName") {
      listError.push({
        en: "Enter a valid first name",
        es: "Ingrese un nombre válido"
      });
    } else if (err.param === "lastName") {
      listError.push({
        en: "Enter a valid last name",
        es: "Ingrese un apellido válido"
      });
    }
  });

  msgResponse(
    res,
    422,
    "validator/wrong-fields",
    "Enter the correct data",
    "Ingrese los datos correctos",
    listError
  );
};

export default responseValidateUser;
