import { Router } from "express";

// Controllers
import { subscribeNewsletter } from "../controllers/newsletter.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

router.post("/", [validateToken], subscribeNewsletter);

export default router;
