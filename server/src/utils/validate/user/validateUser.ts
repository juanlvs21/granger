import { check } from "express-validator";

export const validateEmail = check("email")
  .trim()
  .not()
  .isEmpty()
  .isEmail();

export const validatePassword = check("password")
  .trim()
  .not()
  .isEmpty()
  .isLength({ min: 6 });

export const validateFirstName = check("firstName")
  .trim()
  .not()
  .isEmpty();

export const validateLastName = check("lastName")
  .trim()
  .not()
  .isEmpty();

export const validateToken = check("token")
  .trim()
  .not()
  .isEmpty();
