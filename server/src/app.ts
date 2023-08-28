import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { errorHandler, notFoundHandler } from "@/handlers";
import { userRoutes } from "@/routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
