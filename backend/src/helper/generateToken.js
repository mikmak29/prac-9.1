import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Generate access token with configurable expiration
export const generateToken = (user) => {
	return jwt.sign({ user }, process.env.PRIVATE_ACCESS_TOKEN_KEY, {
		expiresIn: "15m", // 15 minutes (reasonable expiration time)
	});
};

// Generate refresh token with separate expiration (longer than access token)
export const generateRefreshToken = (userPayload) => {
	return jwt.sign(userPayload, process.env.PRIVATE_REFRESH_ACCESS_TOKEN_KEY, {
		expiresIn: "7d", // Refresh token expires in 7 days
	});
};
