import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import express from "express";

import userRoutes from "./routes/user.route.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());

app.use("/api/user", userRoutes);

export default app;
