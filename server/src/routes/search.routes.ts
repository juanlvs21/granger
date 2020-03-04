import { Router } from "express";

// Controllers
import {
  search,
  searchGenre,
  searchStars
} from "../controllers/search.controller";

const router: Router = Router();

router.get("/:search", search);
router.get("/genre/:genre", searchGenre);
router.get("/stars/:stars", searchStars);

export default router;
