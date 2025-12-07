import { Request, Response } from "express";
import { authService } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  try {
    let { name, email, password, phone, role } = req.body;

    // Required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Email lowercase check
    if (/[A-Z]/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must be lowercase only",
      });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await authService.signupUser(
      name,
      email,
      password,
      phone,
      role || "customer"
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error registering user",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Error logging in user",
    });
  }
};

export const authController = {
  signupUser,
  loginUser,
};
