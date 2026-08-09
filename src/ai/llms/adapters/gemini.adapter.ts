import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_FLASH;
if (!apiKey || !model) {
  throw new Error("GEMINI_API_KEY is missing");
}

export const initializeLLM = (): ChatGoogleGenerativeAI => {
  return new ChatGoogleGenerativeAI({
    model,
    temperature: 0.2,
    apiKey,
  });
};

export const llmModel = initializeLLM();
