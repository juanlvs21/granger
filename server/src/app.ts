import express, { Application } from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import booksRoutes from "./routes/books.routes";

const app: Application = express();

// Settings
app.set("port", 4000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

// Routes Static
app.use("/uploads", express.static("/uploads"));

export default app;
