import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    users: [User]
    # user(id: ID!): User
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UserSigninInput {
    email: String!
    password: String!
  }
  
  scalar Date

  type Token {
    token: String
  }

  type Message{
    id:ID!
    text:      String!
    receiverId: Int!
    senderId: Int!
    createdAt: Date!
  }

  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createMessage():Message
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }
`;

export default typeDefs;
