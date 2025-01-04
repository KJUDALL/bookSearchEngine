import type { Request, Response } from "express";
// import user model
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY || "";
// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
export const createUser = async (req: Request, res: Response) => {
	try {
		const newUser = await User.create(req.body);
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json("Failed to create new user.");
	}
};

// get a single user by either their id or their username
export const getSingleUser = async (req: Request, res: Response) => {
	try {
		const foundUser = await User.findOne({
			$or: [
				{ _id: req.user ? req.user._id : req.params.id },
				{ username: req.params.username },
			],
		});

		if (!foundUser) {
			return res
				.status(400)
				.json({ message: "Cannot find a user with this id!" });
		}

		return res.json(foundUser);
	} catch (error) {
		return res.status(500).json("Could not find user.");
	}
};

// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
// {body} is destructured req.body
export const login = async (req: Request, res: Response) => {
	try {
		const userLogin = await User.findOne({
			$or: [{ username: req.body.username }, { email: req.body.email }],
		});
		if (!userLogin) {
			return res.status(400).json({ message: "Can't find this user" });
		}

		const correctPw = await userLogin.isCorrectPassword(req.body.password);
		if (!correctPw) {
			return res.status(400).json({ message: "Wrong password!" });
		}
		const token = jwt.sign(
			{ username: userLogin.username, id: userLogin._id },
			secretKey,
			{ expiresIn: "2h" }
		);
		return res.json({ token, userLogin });
	} catch (error) {
		return res.status(500).json("Failed to login user.");
	}
};

// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// user comes from `req.user` created in the auth middleware function
export const saveBook = async (req: Request, res: Response) => {
	try {
		const saveBook = await User.findOneAndUpdate(
			{ _id: req.user._id },
			{ $addToSet: { savedBooks: req.body } },
			{ new: true, runValidators: true }
		);
		return res.json(saveBook);
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
};

// remove a book from `savedBooks`
export const deleteBook = async (req: Request, res: Response) => {
	try {
		const deleteBook = await User.findOneAndUpdate(
			{ _id: req.user._id },
			{ $pull: { savedBooks: { bookId: req.params.bookId } } },
			{ new: true }
		);
		if (!deleteBook) {
			return res
				.status(404)
				.json({ message: "Couldn't find user with this id!" });
		}
		return res.json(deleteBook);
	} catch (error) {
		return res.status(500).json("Failed to delete book.");
	}
};
