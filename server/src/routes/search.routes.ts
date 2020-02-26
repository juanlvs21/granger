import { Router } from "express";

// Controllers
import { searchGenre, searchStars } from "../controllers/search.controller";

const router: Router = Router();

router.get("/genre/:genre", searchGenre);
router.get("/stars/:stars", searchStars);

export default router;
