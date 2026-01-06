import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const usersTokenSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		accessToken: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export default mongoose.models.Token || mongoose.model("Token", usersTokenSchema, "prac9_tokens");
