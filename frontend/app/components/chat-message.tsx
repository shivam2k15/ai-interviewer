import type { Ref } from "react";
import type { ChatItem } from "./types";

export function ChatMessage({
  item,
  articleRef,
}: Readonly<{
  item: ChatItem;
  articleRef?: Ref<HTMLElement>;
}>) {
  return (
    <article ref={articleRef} className={`card ${item.role}`}>
      <span className="role">{item.role === "user" ? "You" : "Interviewer"}</span>
      <p>{item.content}</p>
    </article>
  );
}
