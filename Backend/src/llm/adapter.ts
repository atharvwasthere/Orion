import { geminiLLM } from "./providers/gemini.ts";
import { mockLLM } from "./providers/mock.ts";

export interface LLMMessage {
  role: string;
  text: string;
}

export interface LLMKnowledge {
  question: string;
  answer: string;
}

export interface LLMResponse {
  text: string;
  confidence: number;
  usage?: {
    total: number;
  };
}

export async function generate({ 
  messages, 
  knowledge 
}: {
  messages: LLMMessage[];
  knowledge: LLMKnowledge[];
}): Promise<LLMResponse> {
  const provider = process.env.LLM_PROVIDER ?? "mock";

  if (provider === "gemini") {
    return geminiLLM({ messages, knowledge });
  }

  // default mock for local testing
  return mockLLM({ messages, knowledge });
}
