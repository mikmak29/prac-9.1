import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
	const MONGO_URI = process.env.MONGO_URL;

	if (!MONGO_URI) {
		return "Cannot find the database String or URL.";
	}

	await mongoose.connect(MONGO_URI);
	console.log(`Server was successfully connected at ${mongoose.connection.db.databaseName}`);
};

export default connectDB;
