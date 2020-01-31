import { Router } from "express";

// Controllers
import { upload } from "../controllers/books.controller";

// Multer
import uploadMulter from "../multer";

const router: Router = Router();

router.post("/upload", uploadMulter.single("bookCover"), upload);

export default router;
