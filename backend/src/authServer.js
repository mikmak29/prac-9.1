import asyncErrorHandler from "express-async-handler";
import app from "./app.js";

app.post(
	"/token",
	asyncErrorHandler((req, res) => {
		const { email, password } = req.body;
	})
);
