import { Request, Response } from "express";
import { bookService } from "./book.service";
import { pool } from "../../config/db";

const PostBook = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    // Validate input
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (isNaN(Number(customer_id)) || isNaN(Number(vehicle_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer_id or vehicle_id",
      });
    }

    // Validate dates
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "rent_end_date must be after rent_start_date",
      });
    }

    // Create booking
    const bookingResult = await bookService.PostBook(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    const booking = bookingResult.rows[0];

    // Get vehicle info for response
    const vehicleQuery = await pool.query(
      `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
      [vehicle_id]
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
          vehicle_name: vehicleQuery.rows[0].vehicle_name,
          daily_rent_price: vehicleQuery.rows[0].daily_rent_price,
        },
      },
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
    const user = (req as any).user;
    const result = await bookService.GetBook(user.userId, user.role);

    let message = "Bookings retrieved successfully";
    if (user.role === "customer") {
      message = "Your bookings retrieved successfully";
    }

    // Format response based on role
    let formattedData;
    if (user.role === "customer") {
      // Customer view - exclude customer_id from individual items
      formattedData = result.rows.map((row: any) => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      }));
    } else {
      // Admin view
      formattedData = result.rows.map((row: any) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
        },
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      }));
    }

    res.status(200).json({
      success: true,
      message: message,
      data: formattedData,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const PutBook = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = (req as any).user;

    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (isNaN(Number(bookingId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    // Update booking
    const result = await bookService.PutBook(
      Number(bookingId),
      status,
      user.userId,
      user.role
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = result.rows[0];
    let message = "Booking updated successfully";

    if (status === "cancelled") {
      message = "Booking cancelled successfully";
    } else if (status === "returned") {
      message = "Booking marked as returned. Vehicle is now available";

      // Include vehicle info for returned bookings
      const vehicleQuery = await pool.query(
        `SELECT availability_status FROM vehicles WHERE id = $1`,
        [booking.vehicle_id]
      );

      return res.status(200).json({
        success: true,
        message: message,
        data: {
          id: booking.id,
          customer_id: booking.customer_id,
          vehicle_id: booking.vehicle_id,
          rent_start_date: booking.rent_start_date,
          rent_end_date: booking.rent_end_date,
          total_price: booking.total_price,
          status: booking.status,
          vehicle: {
            availability_status: vehicleQuery.rows[0].availability_status,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      message: message,
      data: {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
      },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookControllers = {
  PostBook,
  GetBook,
  PutBook,
};
