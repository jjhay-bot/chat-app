import { ApolloServer, gql } from "apollo-server";

const users = [
  {
    id: 1,
    firstName: 'mukesh',
    lastName: 'kumar',
    email: 'mukesh@kumar.com',
    password: '12345'
  },
  {
    id: 2,
    firstName: 'suresh',
    lastName: 'sharma',
    email: 'suresh@sharma.com',
    password: '12346'
  }
]

const typeDefs = gql`
  type Query {
    greet: String
  }
`;

const resolvers = {
  Query: {
    greet: () => "Hello World",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(` Server readt at ${url}`);
});
