import dotenv from "dotenv";
import asyncErrorHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/UserModel.js";
import UsersToken from "../models/UsersTokenModel.js";
import { generateToken, generateRefreshToken } from "../helper/generateToken.js";

dotenv.config();

export const registerUser = asyncErrorHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(404).json("Fields are mandatory to fill.");
	}

	const validateEmail = await User.findOne({ email });

	if (validateEmail) {
		return res.status(404).json("This Email already exist.");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const registerData = await User.create({
		email,
		password: hashedPassword,
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
		return res.status(404).json("Invalid Email.");
	}

	const validatePassword = await bcrypt.compare(password, user.password);

	if (!validatePassword) {
		return res.status(404).json("Invalid Password.");
	}

	const userPayload = {
		id: user._id,
		email: user.email,
	};

	// Access token with shorter expiration (e.g., 15 minutes)
	const accessToken = generateToken(userPayload);

	// Refresh token with longer expiration (e.g., 7 days)
	const refreshToken = generateRefreshToken(userPayload);

	const token = {
		userId: user._id,
		accessToken: accessToken,
		refreshToken: refreshToken,
	};

	await UsersToken.create(token);

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // true only in HTTPS/production
		sameSite: "strict",
		path: "/api/user", // Match the route path where cookie will be read
	});

	res.status(200).json({
		accessToken: token.accessToken,
		refreshToken: refreshToken,
	});
});

export const token = asyncErrorHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) return res.status(401).json({ message: "Invalid or expired token." });
	const validateUserId = await UsersToken.findOne({ refreshToken });

	if (!validateUserId) {
		return res.status(401).json({ message: "Token not found." });
	}

	jwt.verify(refreshToken, process.env.PRIVATE_REFRESH_ACCESS_TOKEN_KEY, (err, decoded) => {
		if (err) {
			return res.status(404).json({ message: "Invalid or expired token." });
		}
		// The decoded payload IS the userPayload (id, email, password)
		// Pass the full userPayload to generateToken to maintain consistency with logInUser
		const userPayload = {
			id: decoded.id,
			email: decoded.email,
		};

		// Generate new access token with same expiration as login (or different if needed)
		const accessToken = generateToken(userPayload);
		res.status(200).json({ token: accessToken });
	});
});

export const current = asyncErrorHandler(async (req, res) => {
	console.log(req.user); // Working!
	res.status(200).json(req.user);
});

export const usersData = asyncErrorHandler(async (req, res) => {
	const data = await User.find();
	res.status(200).json(data);
});

export const usersToken = asyncErrorHandler(async (req, res) => {
	const data = await UsersToken.find();
	res.status(200).json(data);
});

export const deleteToken = asyncErrorHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(404).json({ message: "ID was not found." });
	}

	const removeToken = await UsersToken.findByIdAndDelete(id);

	res.status(200).json({ successfully: removeToken });
});
