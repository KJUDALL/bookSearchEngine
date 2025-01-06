const typeDefs = `
type User {
    username: String
    email: String
    password: String
}

type Book {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}

type Query {
    users: [User]
    user(id: ID!): User
    books: [Book]
    book(id: ID!): Book
}

type Mutation {
    addUser(usernmae: String!, email: String!, password: String!): User
    addBook(title: String!, authors: [String], description: String, bookId: String!, image: String, link: String): Book
}
`;

export { typeDefs };
