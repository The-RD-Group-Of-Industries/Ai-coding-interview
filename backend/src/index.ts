import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/userRoutes";
import interviewRoutes from "./routes/admin.interviewRoute";
import userRoutes from "./routes/user.interviewRoutes";
import path from "path";
import cors from "cors";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running");
});

console.log("MONGO_URI:", process.env.MONGO_URI); // ⬅️ Add this debug line


app.use(
  cors({
    origin: `*`,
    credentials: true,
  })
);

//routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/interview", interviewRoutes);
app.use("/user", userRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
