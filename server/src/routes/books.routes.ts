import { Router } from "express";

// Controllers
import {
  upload,
  deleteBook,
  paymentIntents,
  paymentSucceeded,
  getAll,
  getRecent,
  getWithSlug,
  getPurchases,
  resendBook,
  updateInfoBook,
  updateFilesBook
} from "../controllers/books.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

router.get("/", getAll);
router.get("/recent", getRecent);
router.get("/slug/:slug", getWithSlug);
router.get("/purchases", [validateToken], getPurchases);
router.post("/upload", [validateToken], upload);
router.post("/paymentIntents", [validateToken], paymentIntents);
router.post("/payment-succeeded", [validateToken], paymentSucceeded);
router.post("/purchases/resend", [validateToken], resendBook);
router.delete("/:uuid", [validateToken], deleteBook);
router.put("/:uuid", [validateToken], updateInfoBook);
router.put("/files/:uuid", [validateToken], updateFilesBook);

export default router;
