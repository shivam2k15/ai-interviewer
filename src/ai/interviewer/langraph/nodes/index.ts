import { SystemMessage } from "langchain";
import llmModel from "../../../llms";
import { getSystemPrompt } from "../prompts";
import type { GraphStateType } from "../state";
import { INTERVIEW_LEVEL } from "./constants";
import {
  buildEvaluationPrompt,
  getConversationWindow,
  parseEvaluationResponse,
} from "./conversation";
import {
  getFollowUpRequired,
  getInterviewState,
  getNextDifficultyLevel,
  getTopicProgress,
} from "./transitions";
import { QUESTIONS_PER_TOPIC } from "./constants";

export const askQuestionNode = async (state: GraphStateType) => {
  const systemPrompt = getSystemPrompt(state);

  const updatedHistory = [
    new SystemMessage(systemPrompt),
    ...getConversationWindow(state.history),
  ];
  const response = await llmModel.invoke(updatedHistory);

  //call db service to save the response in the database
  // and if the current topic is END then return the final score and evaluation to the user
  //mark this interview as completed in the database and return the final score and evaluation to the user

  return {
    history: [response],
    interviewLevel: INTERVIEW_LEVEL,
    interviewState: "IN_PROGRESS" as const,
    previousQuestions: [...state.previousQuestions, response.content].slice(
      -QUESTIONS_PER_TOPIC + state.totalFollowUps,
    ),
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
  followUpRequired: getFollowUpRequired(state.evaluation),
  difficultyLevel: getNextDifficultyLevel(state),
});

export const topicManagerNode = (state: GraphStateType) =>
  getTopicProgress(state);

export const scorecardNode = (state: GraphStateType) => ({
  interviewState: getInterviewState(state),
});
