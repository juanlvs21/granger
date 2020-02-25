import { Router } from "express";

// Controllers
import {
  upload,
  paymentIntents,
  paymentSucceeded,
  getAll,
  getWithSlug,
  searchStars,
  searchGenre,
  getAllGenre,
  updateGenre,
  deleteGenre,
  addGenre
} from "../controllers/books.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";
import { validateGenre } from "../utils/validate/book/validateGenre";

const router: Router = Router();

// Book
router.get("/", getAll);
router.get("/slug/:slug", getWithSlug);
router.post("/upload", [validateToken], upload);
router.post("/paymentIntents", [validateToken], paymentIntents);
router.post("/payment-succeeded", [validateToken], paymentSucceeded);

// Search
router.get("/search/genre/:genre", searchGenre);
router.get("/search/stars/:stars", searchStars);

// Genre
router.get("/genre", getAllGenre);
router.post("/genre", [validateToken, validateGenre], addGenre);
router.put("/genre", [validateToken], updateGenre);
router.delete("/genre/:id", [validateToken], deleteGenre);

export default router;
