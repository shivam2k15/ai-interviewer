import { router } from "./src/app/routes";

Bun.serve({
  port: process.env.PORT,
  fetch: async (req: Request): Promise<Response> => {
    return router(req);
  },
});
