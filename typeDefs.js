import { gql } from "apollo-server";

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

export default typeDefs;
