import { ApolloServer, gql } from "apollo-server";
import crypto from "crypto";

const users = [
  {
    id: "111111",
    firstName: "mukesh",
    lastName: "kumar",
    email: "mukesh@kumar.com",
    password: "12345",
  },
  {
    id: "222222",
    firstName: "suresh",
    lastName: "sharma",
    email: "suresh@sharma.com",
    password: "12346",
  },
];

const Todos = [
  {
    title: "buy book",
    by: "111111",
  },
  {
    title: "write code",
    by: "111111",
  },
  {
    title: "record video",
    by: "222222",
  },
];

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(userNew: UserInput!): User
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    todos: [Todo]
  }

  type Todo {
    title: String
    by: ID!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, { id }, {userLoggedIn}) => {
      if (!userLoggedIn) throw new Error("you are not logged in")
      return users.find((item) => item.id == id);
    },
  },
  User: {
    todos: (parent) => {
      return Todos.filter((todo) => todo.by === parent.id);
    },
  },
  Mutation: {
    createUser: (_, { userNew }) => {
      const newUser = {
        id: crypto.randomUUID(),
        ...userNew,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context:{
    userLoggedIn: false
  }
});

server.listen().then(({ url }) => {
  console.log(` Server readt at ${url}`);
});
