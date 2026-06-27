import { HumanMessage } from "@langchain/core/messages";
import { graph } from "./builder";

export async function interviewer(
  prompt: string = "Tell me about yourself",
  sessionId: string = "chat",
): Promise<string> {
  const graphResult = await graph.invoke({
    history: [new HumanMessage(prompt)],
  });

  let aiResponse = graphResult.history.at(-1);

  if (!aiResponse) {
    throw new Error("No AI response returned");
  }

  return String(aiResponse?.content ?? "No response returned.");
}
