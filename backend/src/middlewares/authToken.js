import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token || token === null) return res.status(403).json("Token is invalid or expired.");

	jwt.verify(token, process.env.PRIVATE_ACCESS_KEY, (err, decoded) => {
		if (err) {
			return res.status(404).json("Token is invalid or expired.");
		}

		req.user = decoded.user;
		next();
	});
};
