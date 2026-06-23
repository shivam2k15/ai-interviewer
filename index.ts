import { router } from "./src/routes/index.ts";

Bun.serve({
  port: process.env.PORT,
  fetch: async (req: Request): Promise<Response> => {
    return router(req);
  },
});
