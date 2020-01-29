import express, { Application } from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes";

const app: Application = express();

// Settings
app.set("port", 4000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.use("/api/auth", authRoutes);

export default app;
