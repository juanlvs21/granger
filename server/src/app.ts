import express, { Application } from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import favoritesRoutes from "./routes/favorites.routes";
import booksRoutes from "./routes/books.routes";
import offerWeekRoutes from "./routes/offer-week.routes";
import genresRoutes from "./routes/genres.routes";
import searchRoutes from "./routes/search.routes";
import newsletterRoutes from "./routes/newsletter.routes";

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
app.use("/api/user", userRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/offer-week", offerWeekRoutes);
app.use("/api/genres", genresRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Routes Static
app.use(
  "/uploads/cover",
  express.static(path.join(__dirname, "uploads/cover"))
);

app.use(
  "/public",
  express.static(path.resolve(__dirname, "../", "src/public"))
);

export default app;
