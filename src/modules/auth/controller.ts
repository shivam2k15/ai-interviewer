export const post = async (req: Request) => {
  const newReq = (await req.json()) as {
    username: string;
    password: string;
    name: string;
  };
  const { username, password, name } = newReq;
  if (!username || !password || !name) {
    return new Response(JSON.stringify({ message: "All fields required." }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ username }), {
    headers: { "Content-Type": "application/json" },
  });
};
