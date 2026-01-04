import dotenv from "dotenv";
import asyncErrorHandler from "express-async-handler";
import jwt from "jsonwebtoken";

dotenv.config();

const constants = [
	{
		name: "akim",
		email: "akim@gmail.com",
	},
	{
		name: "akim2",
		email: "akim2@gmail.com",
	},
];

export const userLogIn = asyncErrorHandler(async (req, res) => {
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
