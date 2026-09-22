import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

//todo
//password prepost salted hash hook and login api
//UI login and register, then oauth with gmail

export const createUser = async (user: {
  email: string;
  password: string;
  name: string;
}) => {
  const created = await prisma.user.create({
    data: {
      email: user.email,
      password: user.password,
      name: user.name,
    },
  });
  return created;
};

export const findOne = async (email: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  return user;
};

export const basePrisma = prisma.$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data.password) {
          args.data.password = await Bun.password.hash(args.data.password);
        }

        return query(args);
      },

      async update({ args, query }) {
        if (args.data.password && typeof args.data.password === "string") {
          args.data.password = await Bun.password.hash(args.data.password, {
            algorithm: "argon2id",
            memoryCost: 19456,
            timeCost: 2,
          }); //default not needed
        }

        return query(args);
      },
    },
  },
});
