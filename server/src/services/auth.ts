import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthenticationError";
		Object.defineProperty(this, "name", { value: "AuthenticationError" });
	}
}
interface JwtPayload {
	_id: unknown;
	username: string;
	email: string;
}

export const authenticateToken = ({ req }: { req: any }) => {
	//enforce token needing to be found in header
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		throw new AuthenticationError("Authorization header missing.");
	}

	const token = authHeader.split(" ").pop()?.trim();

	if (!token) {
		throw new AuthenticationError("Token missing from auth header.");
	}

	//try to verify token
	try {
		const secretKey = process.env.JWT_SECRET_KEY || "";
		const decoded = jwt.verify(token, secretKey, { maxAge: "2h" }) as {
			data: JwtPayload;
		};
		req.user = decoded.data;
	} catch (err) {
		console.log("Token validation error:", err);
		throw new AuthenticationError("Invalid or expired token.");
	}

	return req;
};
