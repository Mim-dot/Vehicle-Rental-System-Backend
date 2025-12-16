import { pool } from "../../config/db";

const PostBook = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string
) => {
  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicle_id,
  ]);
  if (vehicle.rows.length === 0) throw new Error("Vehicle not found");

  const dailyPrice = vehicle.rows[0].daily_rent_price;
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const total_price = days * dailyPrice;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
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
