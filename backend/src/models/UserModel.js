import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, "Email is required."],
		},
		password: {
			type: String,
			required: [true, "Password is required."],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export default mongoose.models.User || mongoose.model("User", userSchema, "prac9_users");
