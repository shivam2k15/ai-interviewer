import { CONTEXT_WINDOW_SIZE } from "./constants";
import type { GraphStateType } from "../state";

export const getConversationWindow = (history: GraphStateType["history"]) =>
  history.length > CONTEXT_WINDOW_SIZE + 1
    ? history.slice(-CONTEXT_WINDOW_SIZE)
    : history;

export const buildEvaluationPrompt = (state: GraphStateType) => {
  const reversedHistory = [...state.history].reverse();
  const lastHumanAnswer = reversedHistory.find(
    (message) => message.type === "human",
  );
  const lastAIQuestion = reversedHistory.find(
    (message) => message.type === "ai",
  );

  return `You are an unbiased SENIOR backend interviewer.

Question:
${lastAIQuestion?.content}

Candidate Answer:
${lastHumanAnswer?.content}

Evaluate the answer using these rules:

- CORRECT: Answer is technically accurate and sufficiently complete.
- PARTIAL: Answer demonstrates some technically correct understanding but is incomplete or contains minor mistakes.
- INCORRECT: Answer is technically wrong, irrelevant, or contains NO technical explanation.

IMPORTANT:
If the candidate only expresses lack of knowledge, such as:
"I don't know", "No idea", "Sorry", "I'm not sure", "I haven't worked with this", "I'm not familiar", "Skip", or any similar statement without technical content,

then ALWAYS return:
{
  "score": 0,
  "evaluation": "INCORRECT"
}

Return ONLY valid JSON:

{
  "score": 0-10,
  "evaluation": "CORRECT" | "PARTIAL" | "INCORRECT"
}`;
};

export const parseEvaluationResponse = (content: unknown) => {
  try {
    return JSON.parse(String(content ?? "{}"));
  } catch {
    return {};
  }
};
