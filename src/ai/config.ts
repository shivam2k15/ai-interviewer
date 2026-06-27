import { ChatOllama } from "@langchain/ollama";

export const initializeLLM = (): ChatOllama => {
  return new ChatOllama({
    model: process.env.OLLAMA_MODEL,
    baseUrl: process.env.OLLAMA_BASE_URL,
    temperature: 0,
    keepAlive: "30m",
  });
};

export const llmModel = initializeLLM();
