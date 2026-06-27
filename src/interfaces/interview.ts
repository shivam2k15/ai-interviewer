import type { BaseMessage } from "@langchain/core/messages";

export type Topic =
  | "javascript"
  | "typescript"
  | "async"
  | "react"
  | "api"
  | "database"
  | "system design";

export interface InterviewSession {
  history: BaseMessage[];
  currentTopic: Topic;
  questionsAsked: number;
}
