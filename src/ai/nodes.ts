import { SystemMessage } from "langchain";
import { llmModel } from "./config";
import {
  MAX_FOLLOW_UPS,
  QUESTIONS_PER_TOPIC,
  CONTEXT_WINDOW_SIZE,
} from "../utils/Langchain/helper";
import { getSystemPrompt } from "./prompts";
import type { GraphStateType } from "./state";
import { getNextTopic } from "../utils/Langchain/helper";

const INTERVIEW_LEVEL = "SENIOR" as const;

const getConversationWindow = (history: GraphStateType["history"]) =>
  history.length > CONTEXT_WINDOW_SIZE + 1
    ? history.slice(-CONTEXT_WINDOW_SIZE)
    : history;

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

const buildEvaluationPrompt = (state: GraphStateType) => {
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

const parseEvaluationResponse = (content: unknown) => {
  try {
    return JSON.parse(String(content ?? "{}"));
  } catch {
    return {};
  }
};

export const askQuestionNode = async (state: GraphStateType) => {
  const systemPrompt = getSystemPrompt(state);
  const updatedHistory = [
    new SystemMessage(systemPrompt),
    ...getConversationWindow(state.history),
  ];

  const response = await llmModel.invoke(updatedHistory);

  return {
    history: [response],
    interviewLevel: INTERVIEW_LEVEL,
    interviewState: "IN_PROGRESS" as const,
  };
};

export const evaluatorNode = async (state: GraphStateType) => {
  const response = await llmModel.invoke(buildEvaluationPrompt(state));
  const parsedResponse = parseEvaluationResponse(response?.content);

  return {
    score: parsedResponse?.score ?? 0,
    evaluation: String(parsedResponse?.evaluation ?? "INCORRECT"),
  };
};

export const difficultyManagerNode = (state: GraphStateType) => ({
  followUpRequired:
    state.evaluation === "PARTIAL" || state.evaluation === "INCORRECT",
  difficultyLevel:
    state.score < 4
      ? decreaseDifficulty(state.difficultyLevel)
      : state.score < 7
        ? state.difficultyLevel
        : increaseDifficulty(state.difficultyLevel),
});

export const topicManagerNode = (state: GraphStateType) => {
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

export const scorecardNode = (_state: GraphStateType) => ({});
