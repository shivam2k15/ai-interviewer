import userService from "../../db";

export const create = async (req: Request) => {
  const newReq = (await req.json()) as {
    email: string;
    password: string;
    name: string;
  };
  const { email, password, name } = newReq;
  if (!email || !password || !name) {
    return new Response(JSON.stringify({ message: "All fields required." }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  const respose = await userService.createUser({ email, password, name });

  return new Response(JSON.stringify(respose), {
    headers: { "Content-Type": "application/json" },
  });
};
