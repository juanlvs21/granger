import { Router } from "express";

// Controllers
import { addFavorite, removeFavorite } from "../controllers/user.controller";

const router: Router = Router();

router.post("/favorites/add", addFavorite);
router.post("/favorites/remove", removeFavorite);

export default router;
