"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ChatItem } from "./types";
import { ChatMessage } from "./chat-message";

export function ChatFeed({
  messages,
}: Readonly<{
  messages: ChatItem[];
}>) {
  const latestQuestionRef = useRef<HTMLElement | null>(null);

  const latestQuestionIndex = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.role === "user") {
        return index;
      }
    }

    return -1;
  }, [messages]);

  useEffect(() => {
    if (latestQuestionIndex < 0) {
      return;
    }

    latestQuestionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [latestQuestionIndex]);

  return (
    <section className="list">
      <div className="cards">
        {messages.length === 0 ? (
          <p className="empty">No questions yet.</p>
        ) : (
          messages.map((item, index) => (
            <ChatMessage
              key={`${item.role}-${index}`}
              item={item}
              articleRef={
                index === latestQuestionIndex && item.role === "user"
                  ? latestQuestionRef
                  : undefined
              }
            />
          ))
        )}
      </div>
    </section>
  );
}
