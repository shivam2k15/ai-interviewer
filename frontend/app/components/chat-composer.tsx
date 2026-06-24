"use client";

import type { FormEvent } from "react";

type ChatComposerProps = {
  question: string;
  loading: boolean;
  onQuestionChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ChatComposer({
  question,
  loading,
  onQuestionChange,
  onSubmit,
}: Readonly<ChatComposerProps>) {
  return (
    <section>
      <div className="panel row">
        <div className="col-12">
          <p className="eyebrow">AI-Interviewer (Ollama + Qwen2.5:3b)</p>
          <form className="composer" onSubmit={onSubmit}>
            <label className="composer-field" htmlFor="question-input">
              <span className="sr-only">Question</span>
              <input
                id="question-input"
                value={question}
                onChange={(event) => onQuestionChange(event.currentTarget.value)}
                placeholder="Answer questions..."
                aria-label="Question"
              />
            </label>
            <button className="composer-button" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
