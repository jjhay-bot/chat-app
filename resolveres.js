import { PrismaClient, Prisma } from "@prisma/client";
import { ApolloError, AuthenticationError } from "apollo-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const resolvers = {
  Query: {},

  Mutation: {
    signupUser: async (_, { userNew }) => {
      // By unique identifier
      const user = await prisma.user.findUnique({
        where: {
          email: userNew.email,
        },
      });

      if (user)
        throw new AuthenticationError(
          "User already exists with that email"
        );

      const hashedPassword = await bcrypt.hash(userNew.password, 10);

      const newUser = await prisma.user.create({
        data: {
          ...userNew,
          password: hashedPassword,
        },
      });

      return newUser;
    },

    signinUser: async (_, { userSignin }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: userSignin.email,
        },
      });

      if (!user)
        throw new AuthenticationError(
          "User doesn't exists with that email"
        );

      const doMatch = await bcrypt.compare(userSignin.password, user.password);

      if (!doMatch)
        throw new AuthenticationError("email or password is invalid");

      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.JWT_SECRET
      );

      return { token };
    },
  },
};

export default resolvers;
