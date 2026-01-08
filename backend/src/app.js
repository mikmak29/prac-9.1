import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";

import userRoutes from "./routes/user.route.js";

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://127.0.0.1:5500", // Your frontend URL (domain only, not full path)
		credentials: true, // Allow cookies
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"], // Allow Authorization header
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(compression());

app.use("/api/user", userRoutes);
app.use("/health", (req, res) => {
	res.status(200).json("Server is working", process.uptime);
});

export default app;
