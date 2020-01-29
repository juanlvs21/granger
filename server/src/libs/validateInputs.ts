import { check } from "express-validator";

export const validateEmail = check("email").isEmail();
export const validatePassword = check("password").isLength({ min: 6 });
