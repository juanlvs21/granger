import { Router } from "express";

// Controllers
import {
  getFavorites,
  addFavorite,
  removeFavorite
} from "../controllers/favorites.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

router.get("/", [validateToken], getFavorites);
router.post("/add", [validateToken], addFavorite);
router.post("/remove", [validateToken], removeFavorite);

export default router;
