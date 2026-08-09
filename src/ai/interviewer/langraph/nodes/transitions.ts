import { MAX_FOLLOW_UPS, QUESTIONS_PER_TOPIC } from "./constants";
import type { GraphStateType } from "../state";
import type { InterviewSession } from "../types";

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

const decreaseDifficulty = (
  difficultyLevel: GraphStateType["difficultyLevel"],
) => {
  switch (difficultyLevel) {
    case "EXPERT":
      return "HARD";
    case "HARD":
      return "MEDIUM";
    case "MEDIUM":
    case "EASY":
    default:
      return "EASY";
  }
};

const increaseDifficulty = (
  difficultyLevel: GraphStateType["difficultyLevel"],
) => {
  switch (difficultyLevel) {
    case "EASY":
      return "MEDIUM";
    case "MEDIUM":
      return "HARD";
    case "HARD":
      return "EXPERT";
    case "EXPERT":
    default:
      return "EXPERT";
  }
};

export const getFollowUpRequired = (evaluation: GraphStateType["evaluation"]) =>
  evaluation === "PARTIAL";

export const getNextDifficultyLevel = (state: GraphStateType) =>
  state.score < 4
    ? decreaseDifficulty(state.difficultyLevel)
    : state.score < 7
      ? state.difficultyLevel
      : increaseDifficulty(state.difficultyLevel);

export const getTopicProgress = (state: GraphStateType) => {
  const followUp =
    state.followUpRequired && state.totalFollowUps < MAX_FOLLOW_UPS;

  return {
    totalFollowUps: followUp ? (state.totalFollowUps ?? 0) + 1 : 0,
    followUpRequired: followUp,
    currentTopic: followUp
      ? state.currentTopic
      : state.questionsAsked < QUESTIONS_PER_TOPIC
        ? state.currentTopic
        : getNextTopic(state.currentTopic),
    questionsAsked:
      state.questionsAsked < QUESTIONS_PER_TOPIC ? state.questionsAsked + 1 : 0,
  };
};

export const getInterviewState = (state: GraphStateType) =>
  state.currentTopic === "END" ? "COMPLETED" : state.interviewState;
