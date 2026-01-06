import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateToken = (user, expiresIn) => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_ACCESS_KEY, {
		expiresIn: expiresIn,
	});
};
