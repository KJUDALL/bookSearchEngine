import express from "express";
import db, { bookSearchEngine } from "./config/connection.js";
//import Apollo
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
//import graphQL schema
import { typeDefs, resolvers } from "../src/schemas";
import { authenticateToken } from "./services/auth.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    authenticateToken({ req });
    return { user: req.user };
  },
});

const startApolloServer = async () => {
	await server.start();
	await bookSearchEngine();

	const PORT = process.env.PORT || 3001;
	const app = express();

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	app.use("/graphql", expressMiddleware(server));

	app.listen(PORT, () => {
		console.log("The server is running on ${PORT}!");
		console.log("Use GraphQL at http://localhost:${PORT}/graphql");
	});
};

//call async fx to start server
startApolloServer();
