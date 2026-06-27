import type { InterviewSession } from "../modules/interview/interfaces";

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
    "END",
  ];
  const currentIndex = topics.indexOf(currentTopic);
  return topics[(currentIndex + 1) % topics.length] ?? "END";
};
