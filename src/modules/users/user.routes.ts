import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";

const router = express.Router();
router.post("/", userControllers.createUser);
router.get("/", logger, auth("admin"), userControllers.getUser);
router.get("/:userId", auth("admin"), userControllers.GetSingleUser);
router.put("/:userId", auth("admin", "customer"), userControllers.PutUser);
router.delete("/:userId", auth("admin"), userControllers.DeleteUser);
export const userRoutes = router;
