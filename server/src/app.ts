import express, { Application } from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";

import authRoutes from "./routes/auth.routes";
import booksRoutes from "./routes/books.routes";
import genresRoutes from "./routes/genres.routes";
import searchRoutes from "./routes/search.routes";

const app: Application = express();

// Settings
app.set("port", 4000);

// Enable files upload
app.use(
  fileUpload({
    createParentPath: true
  })
);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/genres", genresRoutes);
app.use("/api/search", searchRoutes);

// Routes Static
app.use(
  "/uploads/cover",
  express.static(path.join(__dirname, "uploads/cover"))
);

app.use("/static", express.static(path.join(__dirname, "static")));

export default app;
