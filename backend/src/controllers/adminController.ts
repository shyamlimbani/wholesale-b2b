import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (email: string) => {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET || "shyam_secure_key",
    {
      expiresIn: "30d",
    }
  );
};

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;

    // HARDCODED ADMIN LOGIN
    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {
      return res.status(200).json({
        success: true,
        email,
        token: generateToken(email),
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
