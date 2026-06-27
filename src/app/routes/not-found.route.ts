export const notFound = () => {
  return new Response("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain" },
  });
};
