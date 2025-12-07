import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

//auth middleware
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return res.status(500).json({
          success: false,
          message: "Unauthorized: No token provided",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as jwt.JwtPayload;

      // Attach user info to request
      (req as any).user = {
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      };

      // Check roles if specified
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Insufficient permissions",
        });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }
  };
};

export default auth;
