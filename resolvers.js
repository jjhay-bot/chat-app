import { PrismaClient, Prisma } from "@prisma/client";
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: async (_, args, { userId }) => {
      if (!userId) {
        throw new ForbiddenError("You must be logged in.");
      }
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          id: {
            not: userId,
          },
        },
      });
      return users;
    },

    messagesByUser: async (_, { receiverId }, { authorization }) => {
      const { userId } = JSON.parse(
        atob(authorization.split(".")[1])
      );

      if (!userId) {
        throw new ForbiddenError("You must be logged in.");
      }

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return messages;
    },
  },

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

      const doMatch = await bcrypt.compare(
        userSignin.password,
        user.password
      );

      if (!doMatch)
        throw new AuthenticationError("email or password is invalid");

      const token = jwt.sign(
        {
          userId: user.id,
          device: "",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { token };
    },

    createMessage: async (
      _,
      { receiverId, text },
      { authorization }
    ) => {
      if (!authorization)
        throw new ForbiddenError("You must be logged in");

      const { userId } = JSON.parse(
        atob(authorization.split(".")[1])
      );

      const message = await prisma.message.create({
        data: {
          text,
          receiverId,
          senderId: userId,
        },
      });

      return message;
    },
  },
};

export default resolvers;
