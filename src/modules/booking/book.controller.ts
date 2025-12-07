import { Request, Response } from "express";
import { bookService } from "./book.service";
import { pool } from "../../config/db";

const PostBook = async (req: Request, res: Response) => {
  const customer_id = Number(req.body.customer_id);
  const vehicle_id = Number(req.body.vehicle_id);
  const { rent_start_date, rent_end_date } = req.body;

  if (isNaN(customer_id) || isNaN(vehicle_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid customer_id or vehicle_id",
    });
  }

  try {
    const vehiclesResult = await bookService.PostBook(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    if (vehiclesResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const dailyPrice = vehiclesResult.rows[0].daily_rent_price;

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const total_price = days * dailyPrice;

    const result = await pool.query(
      `INSERT INTO bookings(
        customer_id, vehicle_id, rent_start_date, rent_end_date,
        total_price, status
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        "pending",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
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

    res
      .status(200)
      .json({
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
