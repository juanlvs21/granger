import { Router } from "express";

// Controllers
import {
  addFavorite,
  removeFavorite
} from "../controllers/favorites.controller";

const router: Router = Router();

router.post("/add", addFavorite);
router.post("/remove", removeFavorite);

export default router;
