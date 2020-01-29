import { Router } from "express";

// Controllers
import { signin, signup, token } from "../controllers/auth.controller";

// Middlewares
import { TokenValidation } from "../libs/verifyToken";

// Express-validator
import { validateEmail, validatePassword } from "../libs/validateInputs";

const router: Router = Router();

router.post("/signup", [validateEmail, validatePassword], signup);
router.post("/signin", [validateEmail], signin);
router.post("/token", token);

export default router;
