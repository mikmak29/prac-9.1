import dotenv from "dotenv";
import asyncErrorHandler from "express-async-handler";

import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8100;

const serverStarter = asyncErrorHandler(async () => {
	app.listen(PORT, () => {
		console.log(`Server was listening at port ${PORT}`);
	});
});

serverStarter();
