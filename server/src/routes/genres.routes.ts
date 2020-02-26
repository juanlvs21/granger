import { Router } from "express";

// Controllers
import {
  getAllGenre,
  updateGenre,
  deleteGenre,
  addGenre
} from "../controllers/genres.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";
import { validateGenre } from "../utils/validate/book/validateGenre";

const router: Router = Router();

router.get("/", getAllGenre);
router.post("/", [validateToken, validateGenre], addGenre);
router.put("/", [validateToken], updateGenre);
router.delete("/:id", [validateToken], deleteGenre);

export default router;
