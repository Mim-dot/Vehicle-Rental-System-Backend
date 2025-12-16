import { Request, Response } from "express";
import { bookService } from "./book.service";
import { pool } from "../../config/db";

const PostBook = async (req: Request, res: Response) => {
  try {
    const customer_id = Number(req.body.customer_id);
    const vehicle_id = Number(req.body.vehicle_id);
    const { rent_start_date, rent_end_date } = req.body;

    // 1️⃣ Validate input
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (isNaN(customer_id) || isNaN(vehicle_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer_id or vehicle_id",
      });
    }

    if (new Date(rent_end_date) <= new Date(rent_start_date)) {
      return res.status(400).json({
        success: false,
        message: "rent_end_date must be after rent_start_date",
      });
    }

    // 2️⃣ Create booking via service
    const bookingResult = await bookService.PostBook(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    // 3️⃣ Return created booking
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: bookingResult.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error creating booking",
    });
  }
};

const GetBook = async (req: Request, res: Response) => {
  try {
    const result = await bookService.GetBook();

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const PutBook = async (req: Request, res: Response) => {
  const bookingId = Number(req.params.bookingId);
  if (isNaN(bookingId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking ID",
    });
  }

  const customer_id = Number(req.body.customer_id);
  const vehicle_id = Number(req.body.vehicle_id);
  const { rent_start_date, rent_end_date, total_price, status } = req.body;

  try {
    const result = await bookService.PutBook(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
      bookingId
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const bookControllers = {
  PostBook,
  GetBook,
  PutBook,
};
