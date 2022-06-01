import { ApolloServer, gql } from "apollo-server";

const users = [
  {
    id: 1,
    firstName: "mukesh",
    lastName: "kumar",
    email: "mukesh@kumar.com",
    password: "12345",
  },
  {
    id: 2,
    firstName: "suresh",
    lastName: "sharma",
    email: "suresh@sharma.com",
    password: "12346",
  },
];

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, { id }, context) => {
      console.log(id)
      return users.find((item) => item.id == id)
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(` Server readt at ${url}`);
});
