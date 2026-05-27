import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET as string || 'fallback_secret', {
    expiresIn: "30d",
  });
};

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    if (email === adminEmail && password === adminPassword) {
      return res.status(200).json({
        success: true,
        email: adminEmail,
        token: generateToken(adminEmail as string),
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};
