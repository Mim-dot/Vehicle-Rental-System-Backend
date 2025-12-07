//db
import { Pool } from "pg";
import config from ".";
export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});
//----------

const initDB = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS vehicless (
  id SERIAL PRIMARY KEY,
  vehicle_name TEXT NOT NULL,
  type TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  daily_rent_price INT NOT NULL,
  availability_status TEXT NOT NULL
)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES users(id),
  vehicle_id INT REFERENCES vehicless(id),
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price INT NOT NULL,
  status TEXT NOT NULL
)`);
};
export default initDB;
