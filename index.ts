import { router } from "./src/app/routes/index.ts";

Bun.serve({
  port: process.env.PORT,
  fetch: async (req: Request): Promise<Response> => {
    return router(req);
  },
});
