import { Annotation } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";
import type { Topic } from "./types";

export const GraphState = Annotation.Root({
  history: Annotation<BaseMessage[]>({
    reducer: (left, right) => right,
    default: () => [],
  }),
  currentTopic: Annotation<Topic>({
    reducer: (left, right) => right,
    default: () => "javascript",
  }),
  questionsAsked: Annotation<number>({
    reducer: (left, right) => right,
    default: () => 0,
  }),
  score: Annotation<number>({
    reducer: (left, right) => right,
    default: () => 0,
  }),
  evaluation: Annotation<"CORRECT" | "PARTIAL" | "INCORRECT">({
    reducer: (left, right) => right,
    default: () => "CORRECT",
  }),
  followUpRequired: Annotation<boolean>({
    reducer: (left, right) => right,
    default: () => false,
  }),
  difficultyLevel: Annotation<"EASY" | "MEDIUM" | "HARD" | "EXPERT">({
    reducer: (left, right) => right,
    default: () => "MEDIUM",
  }),
  interviewLevel: Annotation<"JUNIOR" | "MID" | "SENIOR" | "STAFF" | "LEAD">({
    reducer: (left, right) => right,
    default: () => "SENIOR",
  }),
  interviewState: Annotation<"NOT_STARTED" | "IN_PROGRESS" | "COMPLETED">({
    reducer: (left, right) => right,
    default: () => "NOT_STARTED",
  }),
  totalFollowUps: Annotation<number>({
    reducer: (left, right) => right,
    default: () => 0,
  }),
  previousQuestions: Annotation<string[]>({
    reducer: (left, right) => right,
    default: () => [],
  }),
});

export type GraphStateType = typeof GraphState.State;
