import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookies from "cookie-parser";
import express from "express";

import userRoutes from "./routes/user.route.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookies());
app.use(express.json());
app.use(compression());

app.use("/api/user", userRoutes);
app.use("/health", (req, res) => {
	res.status(200).send("Server is working", process.uptime);
});

export default app;
