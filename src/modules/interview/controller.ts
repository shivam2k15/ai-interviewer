import { interviewer } from "../../ai/index.ts";

export const post = async (req: Request) => {
  const body = (await req.json()) as { message?: string | undefined };
  const prompt = body?.message?.trim();
  if (!prompt) {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const answer = await interviewer(prompt);
  return new Response(JSON.stringify({ answer }), {
    headers: { "Content-Type": "application/json" },
  });
};
