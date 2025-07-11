import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Otp from "../models/Otp";
import { generateToken } from "../utils/generateToken";
import { sendSignupEmail } from "../utils/sendEmail";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const registerUser = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response
): Promise<void> => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields should be filled" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const generatedOTP = Math.floor(100000 + Math.random() * 900000);
    await sendSignupEmail(email, name, generatedOTP);

    await Otp.create({ email, otp: generatedOTP });

    res.status(200).json({ message: "OTP sent to email", email });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, name, password, phone } = req.body;

  try {
    const validOtp = await Otp.findOne({ email, otp });

    if (!validOtp) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUND || "10", 10)
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
    });
    if (user) {
      const token = generateToken({
        id: user._id,
        email: user.email
      });
      await Otp.deleteMany({ email }); 
      res.status(200).json({ message: "User registered successfully", user: user, token: token });
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: (err as Error).message });
  }
};
