import dotenv from "dotenv";
import asyncErrorHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/UserModel.js";
import UsersToken from "../models/UsersTokenModel.js";
import { generateToken, generateRefreshToken } from "../helper/generateToken.js";

dotenv.config();

export const registerUser = asyncErrorHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(404).json("Fields are mandatory to fill.");
	}

	const validatePassword = await User.findOne({ password });

	const ownedEmail = validatePassword;

	if (validatePassword) {
		return res.status(404).json({ message: `This password was already used by ${ownedEmail.email}` });
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
		secure: true, // true in HTTPS
		sameSite: "strict",
		path: "/auth/refresh",
	});

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

	jwt.verify(refreshToken, process.env.PRIVATE_REFRESH_ACCESS_TOKEN_KEY, (err, decoded) => {
		if (err) {
			return res.status(404).json({ message: "Invalid or expired token." });
		}
		// The decoded payload IS the userPayload (id, email, password)
		// Pass the full userPayload to generateToken to maintain consistency with logInUser
		const userPayload = {
			id: decoded.id,
			email: decoded.email,
			password: decoded.password,
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
