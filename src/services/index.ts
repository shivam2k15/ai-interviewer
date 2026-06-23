type MainFunctionSignature = (prompt?: string) => Promise<string>;

export const getAIResponse = async (
  req: Request,
  service: MainFunctionSignature,
) => {
  const body = (await req.json()) as { message?: string | undefined };
  const prompt = body?.message?.trim();
  if (!prompt) {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const answer = await service(prompt);
  return new Response(JSON.stringify({ answer }), {
    headers: { "Content-Type": "application/json" },
  });
};
