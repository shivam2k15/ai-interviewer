import interviewerRoute from "./interviewer.route.ts";
import authRoute from "./auth.route.ts";
import { notFound } from "./not-found.route.ts";

type RouteHandler = (req: Request) => Response | Promise<Response> | undefined;

const routes: Record<string, RouteHandler> = {
  "/api/interview": interviewerRoute,
  "/api/auth": authRoute,
};

export const router = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);
  const handler = routes[pathname];
  const response = await handler?.(req);

  return response ?? notFound();
};
