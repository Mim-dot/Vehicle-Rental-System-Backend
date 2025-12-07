import { pool } from "../../config/db";

const PostBook = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string
) => {
  const result = await pool.query(
    `SELECT daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  return result;
};

const GetBook = async () => {
  const result = await pool.query(`SELECT * FROM bookings`);
  return result;
};

const PutBook = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number,
  status: string,
  bookingId: number
) => {
  const result = await pool.query(
    `UPDATE bookings SET
        customer_id = $1,
        vehicle_id = $2,
        rent_start_date = $3,
        rent_end_date = $4,
        total_price = $5,
        status = $6
      WHERE id = $7
      RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
      bookingId,
    ]
  );
  return result;
};

export const bookService = {
  PostBook,
  GetBook,
  PutBook,
};
