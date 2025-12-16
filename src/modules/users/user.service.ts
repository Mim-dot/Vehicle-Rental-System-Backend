import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
const PostAllUsers = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  // 1️⃣ Reject uppercase emails
  if (/[A-Z]/.test(email)) {
    throw new Error("Email must be lowercase only");
  }

  // 2️⃣ Hash password
  const hashedPass = await bcrypt.hash(password, 10);

  // 3️⃣ Insert user with lowercase email
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, email.toLowerCase(), hashedPass, phone, role]
  );

  return result;
};

const GetUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};
const GetSingleUser = async (userId: any) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
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
  let hashedPass = password;
  if (password) {
    hashedPass = await bcrypt.hash(password, 10);
  }
  const result = await pool.query(
    `UPDATE users SET  
        name = $1,
        email = $2,
        password = $3,
        phone = $4,
        role = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *`,
    [name, email?.toLowerCase(), hashedPass, phone, role, userId]
  );
  return result;
};

const DeleteUser = async (userId: number) => {
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );

  if (activeBookings.rows.length > 0)
    throw new Error("Cannot delete user with active bookings");

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
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
