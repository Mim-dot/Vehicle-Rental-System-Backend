import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const PostAllUsers = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  // Check duplicate email
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPass = await bcrypt.hash(password, 10);

  // Insert user with lowercase email
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPass, phone, role]
  );

  return result;
};

const GetUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result;
};

const GetSingleUser = async (userId: any) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [userId]
  );
  return result;
};

const PutUser = async (
  name: any,
  email: any,
  password: any,
  phone: any,
  role: any,
  userId: any
) => {
  let updateQuery = `UPDATE users SET name = $1, email = $2, phone = $3, role = $4, updated_at = NOW() WHERE id = $5 RETURNING id, name, email, phone, role`;
  let params = [name, email?.toLowerCase(), phone, role, userId];

  // Only update password if provided
  if (password) {
    const hashedPass = await bcrypt.hash(password, 10);
    updateQuery = `UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5, updated_at = NOW() WHERE id = $6 RETURNING id, name, email, phone, role`;
    params = [name, email?.toLowerCase(), hashedPass, phone, role, userId];
  }

  const result = await pool.query(updateQuery, params);
  return result;
};

const DeleteUser = async (userId: number) => {
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );
  return result;
};

export const userService = {
  PostAllUsers,
  GetSingleUser,
  GetUser,
  PutUser,
  DeleteUser,
};
