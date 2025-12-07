// import { pool } from "../../config/db";

// const PostVehicals = async (
//   vehicle_name: any,
//   type: any,
//   registration_number: any,
//   daily_rent_price: any,
//   availability_status: any
// ) => {
//   const result = await pool.query(
//     `INSERT INTO vehicless(vehicle_name, type, registration_number, daily_rent_price, availability_status)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING *`,
//     [
//       vehicle_name,
//       type,
//       registration_number,
//       daily_rent_price,
//       availability_status,
//     ]
//   );
//   return result;
// };
// const GetVehicals = async () => {
//   const result = await pool.query(`SELECT * FROM vehicless`);
//   return result;
// };
// const GetSingleVehicals = async (vehiclesId: any) => {
//   const result = await pool.query(`SELECT * FROM vehicless WHERE id = $1`, [
//     vehiclesId,
//   ]);
//   return result;
// };
// const PutVehicals = async (
//   vehicle_name: any,
//   type: any,
//   registration_number: any,
//   daily_rent_price: any,
//   availability_status: any,
//   vehiclesId: any
// ) => {
//   const result = await pool.query(
//     `UPDATE vehicless SET
//         vehicle_name = $1,
//         type = $2,
//         registration_number = $3,
//         daily_rent_price = $4,
//         availability_status = $5
//       WHERE id = $6
//       RETURNING *`,
//     [
//       vehicle_name,
//       type,
//       registration_number,
//       daily_rent_price,
//       availability_status,
//       vehiclesId,
//     ]
//   );
//   return result;
// };
// const DeletVehicals = async (vehiclesId: any) => {
//   const result = await pool.query(
//     `DELETE FROM vehicless WHERE id = $1 RETURNING *`,
//     [vehiclesId]
//   );
//   return result;
// };
// export const vehicalsservice = {
//   PostVehicals,
//   GetVehicals,
//   GetSingleVehicals,
//   PutVehicals,
//   DeletVehicals,
// };
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
