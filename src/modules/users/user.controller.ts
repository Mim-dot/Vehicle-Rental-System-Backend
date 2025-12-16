import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.GetUser();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      })),
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
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
        message: "User not found",
      });
    }

    const user = result.rows[0];
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const PutUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email, phone, role } = req.body;
  const currentUser = (req as any).user;

  try {
    // Check authorization: customer can only update their own profile
    if (
      currentUser.role === "customer" &&
      Number(userId) !== currentUser.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own profile",
      });
    }

    // Check if user exists
    const existingUser = await userService.GetSingleUser(userId);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await userService.PutUser(
      name || existingUser.rows[0].name,
      email || existingUser.rows[0].email,
      undefined, // Don't update password through this endpoint
      phone || existingUser.rows[0].phone,
      role || existingUser.rows[0].role,
      userId
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = result.rows[0];
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const DeleteUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const result = await userService.DeleteUser(userId);

    if (result.rowCount === 0 || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const userControllers = {
  getUser,
  GetSingleUser,
  PutUser,
  DeleteUser,
};
