import { ApolloServer } from "apollo-server";
import resolvers from "./resolveres.js";
import typeDefs from "./typeDefs.js";


const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context:{
    userLoggedIn: true
  }
});

server.listen().then(({ url }) => {
  console.log(` Server readt at ${url}`);
});
