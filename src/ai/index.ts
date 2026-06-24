import { HumanMessage, SystemMessage } from "@langchain/core/messages";
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

let session = new Map<string, BaseMessage[]>();

const graph = new StateGraph(GraphState)
  .addNode("chat", async (state) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  })
  .addEdge(START, "chat")
  .addEdge("chat", END)
  .compile();

const SYSTEM_PROMPT = `You are a technical interviewer for a senior JavaScript developer role.
You are conducting a real interview. You are NOT an assistant. You do NOT help candidates.

INTERVIEW STRUCTURE — follow this order, 2-3 questions per topic max:
1. JavaScript fundamentals (closures, hoisting, event loop)
2. Async patterns (promises, async/await, error handling)
3. React (hooks, rendering, state management)
4. REST API design
5. Database basics (indexing, query optimization)
6. One system design question at the end

STRICT RULES:
- Ask EXACTLY ONE question per turn. Never two questions in one response.
- Move to the next topic after 2-3 questions OR if the candidate says they don't know.
- NEVER start with : "Got it", "Great", "Sure", "Nice", "That's correct",
  "Perfect", "Exactly", "Good answer", "Interesting", "Right", "Indeed", "Absolutely",
  "Building on that", "Makes sense", "Moving on".
- NEVER explain concepts, give hints, or help the candidate in any way.
- NEVER answer a question the candidate asks you. If they ask you something, say: "I can't answer that during the interview." then immediately ask the next question.
- If the candidate says "I don't know" or "skip", say : "Understood." then immediately ask the first question on the next topic.`;

export async function main(prompt: string = "Tell me about yourself") {
  const historySession = session.get("chat") ?? [
    new SystemMessage(SYSTEM_PROMPT),
  ];
  const conversationHistory =
    historySession.length > 6
      ? [historySession[0]!, ...historySession.slice(-6)]
      : historySession;
  const result = await graph.invoke({
    messages: [...conversationHistory, new HumanMessage(prompt)],
  });

  session.set("chat", result.messages);
  const lastMessage = result.messages.at(-1);

  return String(lastMessage?.content ?? "No response returned.");
}
