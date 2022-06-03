import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";
import resolvers from "./resolveres.js";
import typeDefs from "./typeDefs.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      //decode token
      const { userId } = jwt.verify(
        authorization,
        process.env.JWT_SECRET
      );
      return { userId };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(` Server readt at ${url}`);
});
