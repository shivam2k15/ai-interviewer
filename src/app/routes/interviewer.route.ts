import { postInterviewer } from "../../modules";
import { withCors } from "../middlewares/cors.middleware.ts";

type MethodHandler = (req: Request) => Response | Promise<Response>;

const methodHandlers: Record<string, MethodHandler> = {
  POST: postInterviewer,
};

function interviewerRoute(req: Request) {
  const handler = methodHandlers[req.method];

  return handler?.(req) ?? new Response("Method Not Allowed", { status: 405 });
}

export default withCors(interviewerRoute);
