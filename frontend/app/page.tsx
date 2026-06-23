"use client";

import { FormEvent, useState } from "react";
import { getChatResponse } from "./service";

type ChatItem = {
  role: "user" | "assistant" | "error";
  content: string;
};

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
      <section className="panel">
        <p className="eyebrow">Ollama + LangGraph</p>
        <h1>Ask a question</h1>
        <p className="subcopy">
          Type a prompt, send it to the local API, and render the response in a
          simple list below.
        </p>

        <form className="composer" onSubmit={onSubmit}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask something..."
            aria-label="Question"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </section>

      <section className="list">
        <h2>Q and A</h2>
        <div className="cards">
          {messages.length === 0 ? (
            <p className="empty">No messages yet.</p>
          ) : (
            messages.map((item, index) => (
              <article className={`card ${item.role}`} key={`${item.role}-${index}`}>
                <span className="role">{item.role}</span>
                <p>{item.content}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
