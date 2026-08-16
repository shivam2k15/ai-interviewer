import { START, END, StateGraph, MemorySaver } from "@langchain/langgraph";
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
    .addConditionalEdges(
      "scorecard",
      (state) => (state.interviewState === "COMPLETED" ? END : "ask_question"),
      { [END]: END, ask_question: "ask_question" },
    )
    .addEdge("ask_question", END)
    .addEdge("evaluator", "difficulty_manager")
    .addEdge("difficulty_manager", "topic_manager")
    .addEdge("topic_manager", "scorecard")
    .compile({
      checkpointer: new MemorySaver(),
    });
};

export const graph = buildGraph();
