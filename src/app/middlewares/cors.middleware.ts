const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_BASE_URL ?? "",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type Handler = (req: Request) => Promise<Response> | Response;

export const withCors = (handler: Handler): Handler => {
  return async (req) => {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const response = await handler(req);

    const headers = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  };
};
