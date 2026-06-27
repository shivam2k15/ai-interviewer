import { START, END, StateGraph } from "@langchain/langgraph";
import { GraphState } from "./state";
import {
  askQuestionNode,
  difficultyManagerNode,
  evaluatorNode,
  scorecardNode,
  topicManagerNode,
} from "./nodes";

export const buildGraph = () => {
  return new StateGraph(GraphState)
    .addNode("ask_question", askQuestionNode)
    .addNode("evaluator", evaluatorNode)
    .addNode("difficulty_manager", difficultyManagerNode)
    .addNode("topic_manager", topicManagerNode)
    .addNode("scorecard", scorecardNode)
    .addConditionalEdges(
      START,
      (state) =>
        state.interviewState === "NOT_STARTED" ? "ask_question" : "evaluator",
      { ask_question: "ask_question", evaluator: "evaluator" },
    )
    .addEdge("ask_question", END)
    .addEdge("evaluator", "difficulty_manager")
    .addEdge("difficulty_manager", "topic_manager")
    .addEdge("topic_manager", "scorecard")
    .addEdge("scorecard", "ask_question")
    .compile();
};

export const graph = buildGraph();
