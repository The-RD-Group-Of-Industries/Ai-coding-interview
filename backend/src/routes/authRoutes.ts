import { loginUser, registerUser, verifyOtp } from "../controllers/authController";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser); 

export default router; 