import User from "../models/User";
import { Request, Response } from "express";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({ role: "user" }, "-password");

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json({ users });
    return;
  } catch (err) {
    console.error("Error fetching users:", (err as Error).message);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({message: "User deleted successfully"})
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ error: (err as Error).message });
  }
};
