import { Router } from "express";

// Controllers
import {
  upload,
  all,
  allGenre,
  addGenre
} from "../controllers/books.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

// Book
router.get("/all", all);
router.post("/upload", validateToken, upload);

// Genre
router.get("/genre", allGenre);
router.post("/genre", validateToken, addGenre);

export default router;
