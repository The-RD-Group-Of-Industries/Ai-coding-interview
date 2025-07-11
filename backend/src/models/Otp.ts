import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 min
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
