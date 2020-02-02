import { Router } from "express";

// Controllers
import { uploadCover } from "../controllers/books.controller";

// Middlewares
import { validateToken } from "../utils/validateToken";

const router: Router = Router();

router.post("/upload/cover", validateToken, uploadCover);

export default router;
