import { main } from "../ai/index.ts";
import { getAIResponse } from "../services/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_BASE_URL ?? "",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const router = (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  if (req.method === "OPTIONS" && url.pathname === "/api/chat") {
    return Promise.resolve(
      new Response(null, {
        status: 204,
        headers: corsHeaders,
      }),
    );
  }

  if (req.method === "POST" && url.pathname === "/api/chat") {
    return getAIResponse(req, main).then((response) => {
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    });
  }
  return Promise.resolve(
    new Response(JSON.stringify({ error: "path not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    }),
  );
};
