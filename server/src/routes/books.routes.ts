import { Router } from "express";

// Controllers
import {
  upload,
  paymentIntents,
  paymentSucceeded,
  getAll,
  getWithSlug
} from "../controllers/books.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

router.get("/", getAll);
router.get("/slug/:slug", getWithSlug);
router.post("/upload", [validateToken], upload);
router.post("/paymentIntents", [validateToken], paymentIntents);
router.post("/payment-succeeded", [validateToken], paymentSucceeded);

export default router;
