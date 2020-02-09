import { Router } from "express";

// Controllers
import { signin, signup, token } from "../controllers/auth.controller";

// Express-validator
import {
  validateEmail,
  validatePassword,
  validateFirstName,
  validateLastName,
  validateToken
} from "../utils/validate/user/validateUser";

const router: Router = Router();

router.post(
  "/signup",
  [validateEmail, validatePassword, validateFirstName, validateLastName],
  signup
);
router.post("/signin", [validateEmail], signin);
router.post("/token", [validateToken], token);

export default router;
