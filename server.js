import { ApolloServer, gql } from "apollo-server";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import jwt from "jsonwebtoken";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authorization = req.headers['authorization'];

    return {authorization}

  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
