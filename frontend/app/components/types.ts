export type Theme = "light" | "dark";

export type ChatItem = {
  role: "user" | "assistant" | "error";
  content: string;
};
