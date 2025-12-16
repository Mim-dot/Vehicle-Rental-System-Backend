import { pool } from "../../config/db";

export interface Vehicle {
  id?: number;
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: boolean;
}

const PostVehicle = async (vehicle: Vehicle) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      vehicle.vehicle_name,
      vehicle.type,
      vehicle.registration_number,
      vehicle.daily_rent_price,
      vehicle.availability_status,
    ]
  );
  return result;
};

const GetVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const GetSingleVehicle = async (vehicleId: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);
  return result;
};

const PutVehicle = async (vehicleId: number, vehicle: Partial<Vehicle>) => {
  const result = await pool.query(
    `UPDATE vehicles SET
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
    WHERE id = $6
    RETURNING *`,
    [
      vehicle.vehicle_name,
      vehicle.type,
      vehicle.registration_number,
      vehicle.daily_rent_price,
      vehicle.availability_status,
      vehicleId,
    ]
  );
  return result;
};

const DeleteVehicle = async (vehicleId: number) => {
  // Check if vehicle has active bookings
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status='active'`,
    [vehicleId]
  );
  if (activeBookings.rows.length > 0)
    throw new Error("Cannot delete vehicle with active bookings");

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
    [vehicleId]
  );
  return result;
};

export const vehicleService = {
  PostVehicle,
  GetVehicles,
  GetSingleVehicle,
  PutVehicle,
  DeleteVehicle,
};
