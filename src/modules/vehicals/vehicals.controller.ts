import { Request, Response } from "express";
import { vehicleService, Vehicle } from "./vehicals.service";

// POST /vehicles
const PostVehicals = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    daily_rent_price == null ||
    availability_status == null
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const result = await vehicleService.PostVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /vehicles
const GetVehicals = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.GetVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /vehicles/:vehiclesId
const GetSingleVehicals = async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehiclesId);
  if (isNaN(vehicleId))
    return res
      .status(400)
      .json({ success: false, message: "Invalid vehicle ID" });

  try {
    const result = await vehicleService.GetSingleVehicle(vehicleId);
    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /vehicles/:vehiclesId
const PutVehicals = async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehiclesId);
  if (isNaN(vehicleId))
    return res
      .status(400)
      .json({ success: false, message: "Invalid vehicle ID" });

  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehicleService.PutVehicle(vehicleId, {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /vehicles/:vehiclesId
const DeletVehicals = async (req: Request, res: Response) => {
  const vehicleId = Number(req.params.vehiclesId);
  if (isNaN(vehicleId))
    return res
      .status(400)
      .json({ success: false, message: "Invalid vehicle ID" });

  try {
    const result = await vehicleService.DeleteVehicle(vehicleId);
    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const vehicalscontroller = {
  PostVehicals,
  GetVehicals,
  GetSingleVehicals,
  PutVehicals,
  DeletVehicals,
};
