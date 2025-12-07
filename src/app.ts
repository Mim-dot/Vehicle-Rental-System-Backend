import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/user.routes";
import { vehicalsrouter } from "./modules/vehicals/vehicals.routes";
import { bookRoutes } from "./modules/booking/book.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();
app.use(express.json());
//db
initDB();
//logger middleware
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Assignment 2");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicalsrouter);
app.use("/api/v1/bookings", bookRoutes);
app.use("/api/v1/auth", authRoutes);
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
export default app;
