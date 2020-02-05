import { Router } from "express";

// Controllers
import { upload, all } from "../controllers/books.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

router.get("/all", all);
router.post("/upload", validateToken, upload);

export default router;
