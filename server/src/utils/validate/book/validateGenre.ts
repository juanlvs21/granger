import { check } from "express-validator";

export const validateGenre = check("genre")
  .trim()
  .not()
  .isEmpty()