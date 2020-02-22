import { Router } from "express";

// Controllers
import {
  upload,
  getAll,
  getWithSlug,
  searchStars,
  searchGenre,
  getAllGenre,
  addGenre
} from "../controllers/books.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";
import { validateGenre } from "../utils/validate/book/validateGenre"

const router: Router = Router();

// Book
router.get("/", getAll);
router.get("/slug/:slug", getWithSlug);
router.post("/upload", [validateToken], upload);

// Search
router.get("/search/genre/:genre", searchGenre);
router.get("/search/stars/:stars", searchStars);

// Genre
router.get("/genre", getAllGenre);
router.post("/genre", [validateToken, validateGenre], addGenre);

export default router;
