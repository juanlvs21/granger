import { Router } from "express";

// Controllers
import { signin, signup, token } from "../controllers/auth.controller";

// Express-validator
import { validateEmail, validatePassword } from "../utils/validateInputs";

const router: Router = Router();

router.post("/signup", [validateEmail, validatePassword], signup);
router.post("/signin", [validateEmail], signin);
router.post("/token", token);

export default router;
