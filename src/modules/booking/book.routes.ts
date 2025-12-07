import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehicalscontroller } from "../vehicals/vehicals.controller";
import { bookControllers } from "./book.controller";
import auth from "../../middleware/auth";

const router = express.Router();
router.post("/", auth("customer", "admin"), bookControllers.PostBook);
router.get("/", auth("customer", "admin"), bookControllers.GetBook);
router.put("/:bookingId", auth("customer", "admin"), bookControllers.PutBook);
export const bookRoutes = router;
