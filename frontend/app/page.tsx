"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ChatComposer } from "./components/chat-composer";
import { ChatFeed } from "./components/chat-feed";
import { ThemeToggle } from "./components/theme-toggle";
import { getChatResponse } from "./service";
import type { ChatItem } from "./components/types";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = question.trim();
    if (!prompt || loading) {
      return;
    }

    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: prompt }]);
    setQuestion("");

    try {
      const answer = await getChatResponse(prompt);

      setMessages((current) => [
        ...current,
        { role: "assistant", content: answer },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "error",
          content:
            error instanceof Error ? error.message : "Something went wrong",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <div className="topbar">
        <h3>AI-Interviewer</h3>
        <ThemeToggle />
      </div>

      <ChatFeed messages={messages} />

      <ChatComposer
        question={question}
        loading={loading}
        onQuestionChange={setQuestion}
        onSubmit={onSubmit}
      />
    </main>
  );
}
