import dotenv from "dotenv";
import asyncErrorHandler from "express-async-handler";
import jwt from "jsonwebtoken";

dotenv.config();

export const registerUser = asyncErrorHandler(async (req, res) => {
	const { name, email } = req.body;

	if (!name || !email) {
		return res.status(404).json("Both Name and Email are mandatory to fill.");
	}

	const data = constants.push({
		name,
		email,
	});

	console.log({ createdData: data });
	console.log(constants);

	res.status(200).json(data);
});

export const logInUser = asyncErrorHandler(async (req, res) => {
	const { name, email } = req.body;

	if (!name || !email) {
		return res.status(404).json("Wrong email!");
	}

	const accessToken = jwt.sign(
		{
			user: {
				name: req.body?.name,
				email: req.body?.email,
			},
		},
		process.env.PRIVATE_ACCESS_KEY,
		{ expiresIn: "1m" }
	);
	console.log({ accessToken: accessToken });
	res.status(200).json({ accessToken: accessToken });
});

export const current = asyncErrorHandler(async (req, res) => {
	res.status(200).json(constants.filter((data) => data.name === req.user.name));
});
