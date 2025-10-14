import { mockLLM } from "./providers/mock";
// future: import { openaiLLM } from "./providers/openai"

export async function generate({ system, messages, knowledge }) {
  if (process.env.LLM_PROVIDER === "mock") {
    return mockLLM({ messages, knowledge });
  }
  throw new Error("LLM provider not implemented");
}
