import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const loginAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request Body:", { email, password });

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      console.log("Login Success:", adminEmail);
      const responseData = {
        email: adminEmail,
        token: generateToken(adminEmail as string),
      };
      console.log("API Response:", responseData);
      res.json(responseData);
    } else {
      console.log("Login Failure: Invalid credentials");
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};
