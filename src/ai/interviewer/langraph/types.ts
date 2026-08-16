import type { BaseMessage } from "@langchain/core/messages";

export type Topic =
  | "javascript"
  | "typescript"
  | "async"
  | "database"
  | "react"
  | "api"
  | "system design"
  | "nodejs"
  | "END";

export interface InterviewSession {
  history: BaseMessage[];
  currentTopic: Topic;
  questionsAsked: number;
}
