import { pool } from "../../config/db";

const PostBook = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string
) => {
  // Get vehicle info
  const vehicleQuery = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );
  if (vehicleQuery.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleQuery.rows[0];

  // Check vehicle availability
  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  // Calculate total price
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    throw new Error("End date must be after start date");
  }

  const total_price = days * vehicle.daily_rent_price;

  // Create booking
  const bookingResult = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  // Update vehicle status to booked
  await pool.query(
    `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
    ["booked", vehicle_id]
  );

  return bookingResult;
};

const GetBook = async (userId?: number, role?: string) => {
  if (role === "customer" && userId) {
    // Customer can only see their own bookings
    const result = await pool.query(
      `SELECT b.*, v.vehicle_name, v.registration_number, v.type
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.customer_id = $1
       ORDER BY b.id DESC`,
      [userId]
    );
    return result;
  } else {
    // Admin can see all bookings
    const result = await pool.query(
      `SELECT b.*, 
              u.name as customer_name, u.email as customer_email,
              v.vehicle_name, v.registration_number
       FROM bookings b
       JOIN users u ON b.customer_id = u.id
       JOIN vehicles v ON b.vehicle_id = v.id
       ORDER BY b.id DESC`
    );
    return result;
  }
};

const PutBook = async (
  bookingId: number,
  status: string,
  userId?: number,
  role?: string
) => {
  // Get current booking
  const currentBookingQuery = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (currentBookingQuery.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = currentBookingQuery.rows[0];

  // Validate status transitions
  if (role === "customer") {
    // Customer can only cancel their own active bookings before start date
    if (booking.customer_id !== userId) {
      throw new Error("You can only update your own bookings");
    }
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }
    if (booking.status !== "active") {
      throw new Error("Cannot cancel a non-active booking");
    }
    // Check if booking hasn't started yet
    const startDate = new Date(booking.rent_start_date);
    if (startDate <= new Date()) {
      throw new Error("Cannot cancel a booking that has already started");
    }
  } else if (role === "admin") {
    // Admin can mark as returned
    if (
      status !== "returned" &&
      status !== "cancelled" &&
      status !== "active"
    ) {
      throw new Error("Invalid status");
    }
  } else {
    throw new Error("Unauthorized");
  }

  // Update booking
  const updateResult = await pool.query(
    `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, bookingId]
  );

  // If status changed to returned or cancelled, update vehicle availability
  if (
    (status === "returned" || status === "cancelled") &&
    booking.status === "active"
  ) {
    await pool.query(
      `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
      ["available", booking.vehicle_id]
    );
  }

  return updateResult;
};

export const bookService = {
  PostBook,
  GetBook,
  PutBook,
};
