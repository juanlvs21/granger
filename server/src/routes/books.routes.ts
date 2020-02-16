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

const router: Router = Router();

// Book
router.get("/", getAll);
router.get("/slug/:slug", getWithSlug);
router.post("/upload", validateToken, upload);

// Search
router.get("/search/genre/:genre", searchGenre);
router.get("/search/stars/:stars", searchStars);

// Genre
router.get("/genre", getAllGenre);
router.post("/genre", validateToken, addGenre);

export default router;
