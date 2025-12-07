import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await userService.PostAllUsers(
      name,
      email,
      password,
      phone,
      role
    );
    //console.log(result);
    res.status(201).json({
      success: true,
      message: "Data Instered",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.log("CREATE USER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong!",
      details: err,
    });
  }
};
const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.GetUser();
    res.status(200).json({
      success: true,
      message: "Users recived successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};
const GetSingleUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await userService.GetSingleUser(userId);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Fetch successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const PutUser = async (req: Request, res: Response) => {
  console.log("BODY:", req.body);
  const { userId } = req.params;
  const { name, email, password, phone, role } = req.body;

  try {
    const result = await userService.PutUser(
      name,
      email,
      password,
      phone,
      role,
      userId
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const DeleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await userService.DeleteUser(userId);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user delete successfully",
        data: result.rows,
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetch successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const userControllers = {
  createUser,
  getUser,
  GetSingleUser,
  PutUser,
  DeleteUser,
};
