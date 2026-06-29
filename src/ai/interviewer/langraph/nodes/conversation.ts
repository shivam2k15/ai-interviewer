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

  return `Evaluate this senior developer answer.
Answer: ${lastHumanAnswer?.content}
For question: ${lastAIQuestion?.content}

Return ONLY JSON.

{
"score": 1-10,
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
