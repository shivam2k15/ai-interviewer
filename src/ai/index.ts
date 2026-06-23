import { HumanMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";

const model = new ChatOllama({
  model: process.env.OLLAMA_MODEL,
  baseUrl: process.env.OLLAMA_BASE_URL,
  temperature: 0,
  keepAlive: "30m",
});

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
    default: () => [],
  }),
});

const graph = new StateGraph(GraphState)
  .addNode("chat", async (state) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  })
  .addEdge(START, "chat")
  .addEdge("chat", END)
  .compile();

export async function main(
  prompt: string = "will it rain in idore today? in one word answer yes or noin india indore in mp",
) {
  const result = await graph.invoke({
    messages: [new HumanMessage(prompt)],
  });

  const lastMessage = result.messages.at(-1);
  return String(lastMessage?.content ?? "No response returned.");
}
