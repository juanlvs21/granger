import { Router } from "express";

// Controllers
import {
  getOffer,
  addOffer,
  deleteOffer
} from "../controllers/offer-week.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

router.get("/", getOffer);
router.post("/", [validateToken], addOffer);
router.delete("/:id", [validateToken], deleteOffer);

export default router;
