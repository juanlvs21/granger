import { Router } from "express";

// Controllers
import {
  upload,
  all,
  searchStars,
  searchGenre,
  allGenre,
  addGenre
} from "../controllers/books.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

// Book
router.get("/all", all);
router.post("/upload", validateToken, upload);

// Search
router.get("/search/genre/:genre", searchGenre);
router.get("/search/stars/:stars", searchStars);

// Genre
router.get("/genre", allGenre);
router.post("/genre", validateToken, addGenre);

export default router;
