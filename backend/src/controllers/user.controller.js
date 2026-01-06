import dotenv from "dotenv";
import asyncErrorHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/UserModel.js";
import UsersToken from "../models/UsersTokenModel.js";
import { generateToken } from "../helper/generateToken.js";

dotenv.config();

export const registerUser = asyncErrorHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(404).json("Fields are mandatory to fill.");
	}

	if (email) {
		return res.status(404).json("This email is already used.");
	}

	const registerData = await User.create({
		email,
		password,
	});

	res.status(200).json(registerData);
});

export const logInUser = asyncErrorHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(404).json("Wrong email!");
	}

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).json("User not found!");
	}

	const userPayload = {
		id: user._id,
		email: user.email,
		password: user.password,
	};

	const accessToken = jwt.sign({ user: userPayload }, process.env.PRIVATE_ACCESS_KEY, {
		expiresIn: "30s",
	});
	const refreshToken = generateToken(userPayload, "7d");

	const token = {
		userId: user._id,
		accessToken: accessToken,
		refreshToken: refreshToken,
	};

	await UsersToken.create(token);

	res.status(200).json({
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
	});
});

export const token = asyncErrorHandler(async (req, res) => {
	const { refreshToken } = req.body;
	if (!refreshToken) return res.status(401).json({ message: "Invalid or expired token." });
	const validateUserId = await UsersToken.findOne({ refreshToken });

	if (!validateUserId) {
		return res.status(401).json({ message: "Token not found." });
	}

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_ACCESS_KEY, (err, decoded) => {
		if (err) {
			return res.status(404).json({ message: "Invalid or expired token." });
		}
		const userPayload = {
			id: decoded.id,
			email: decoded.email,
		};
		const newAccessToken = jwt.sign({ user: userPayload }, process.env.PRIVATE_ACCESS_KEY, {
			expiresIn: "15m",
		});
		res.status(200).json({ accessToken: newAccessToken });
	});
});

export const current = asyncErrorHandler(async (req, res) => {
	console.log(req.user); // Working!
	res.status(200).json(req.user);
});
