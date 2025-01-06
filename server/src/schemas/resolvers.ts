import { User } from "../models";
import { Book } from "../models";

const resolvers = {
	Query: {
		users: async () => User.find(),
		user: async (_: any, { id }: { id: string }) => User.findById(id),
		books: async () => Book.find(),
		book: async (_: any, { id }: { id: string }) => Book.findById(id),
	},
	Mutation: {
		addUser: async (
			_: any,
			{
				username,
				email,
				password,
			}: { username: string; email: string; password: string }
		) => {
			const user = new User({ username, email, password });
			await user.save();
			return user;
		},
		addBook: async (
			_: any,
			{ title, author }: { title: string; author: string }
		) => {
			const book = new Book({ title, author });
			await book.save();
			return book;
		},
	},
};

export { resolvers };
