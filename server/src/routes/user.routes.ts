import { Router } from "express";

// Controllers
import { updateProfile, changePassword } from "../controllers/user.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

// Express-validator
import {
  validateEmail,
  validateFirstName,
  validateLastName
} from "../utils/validate/user/validateUser";

const router: Router = Router();

router.put(
  "/",
  [validateToken, validateEmail, validateFirstName, validateLastName],
  updateProfile
);
router.post("/change-password", [validateToken], changePassword);

export default router;
