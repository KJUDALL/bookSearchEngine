import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bookSearchEngine";

const bookSearchEngine = async (): Promise<typeof mongoose.connection> => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("DB successfully connected.");
		return mongoose.connection;
	} catch (error) {
		console.error("DB connection error:", error);
		throw new Error("DB connection failed.");
	}
};

export { bookSearchEngine };

export default bookSearchEngine();
