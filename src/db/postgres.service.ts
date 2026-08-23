import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const createUser = async (user: {
  username: string;
  password: string;
  name: string;
}) => {
  const created = await prisma.user.create({
    data: {
      email: user.username,
      password: user.password,
      name: user.name,
    },
  });
  return created;
};
