// Initialize environment variables first to configure Cloudinary and Mongo
import dotenv from "dotenv";
dotenv.config(); // Must be called before any imports that use process.env

import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import fs from "fs";
import path from "path";

// Routes
import packageRoutes from "./routes/packageRoutes";
// import bookingRoutes from "./routes/bookingRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import subscriberRoutes from "./routes/subscriberRoutes";
import { initCronJobs } from "./jobs/newsletterJob";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve local fallback uploaded static files
const uploadsDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/travel-booking")
  .then(() => {
    console.log("Connected to MongoDB");
    initCronJobs(); // Start cron jobs after DB connection
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api/packages", packageRoutes);
// app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/subscribers", subscriberRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running smoothly" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
