import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";

const router = express.Router();
// Create user (registration) - should be public, but usually handled in auth, not here
// router.post("/", userControllers.createUser); // If needed, keep for admin creation

// Get all users (admin only)
router.get("/", logger, auth("admin"), userControllers.getUser);

// Get single user (admin only)
router.get("/:userId", auth("admin"), userControllers.GetSingleUser);

// Update user (admin or own profile)
router.put("/:userId", auth("admin", "customer"), userControllers.PutUser);

// Delete user (admin only)
router.delete("/:userId", auth("admin"), userControllers.DeleteUser);
export const userRoutes = router;
