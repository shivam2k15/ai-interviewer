import type { InterviewSession } from "../../interfaces/interview";

export const QUESTIONS_PER_TOPIC = 2;

export const MAX_FOLLOW_UPS = 1;

export const CONTEXT_WINDOW_SIZE = 6;

export const getNextTopic = (
  currentTopic: InterviewSession["currentTopic"],
): InterviewSession["currentTopic"] => {
  const topics: InterviewSession["currentTopic"][] = [
    "javascript",
    "typescript",
    "async",
    "react",
    "api",
    "database",
    "system design",
  ];
  const currentIndex = topics.indexOf(currentTopic);
  return topics[(currentIndex + 1) % topics.length] ?? "javascript";
};
