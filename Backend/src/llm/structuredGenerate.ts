import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface StructuredMessage {
  role: string;
  text: string;
}

export interface StructuredKnowledge {
  question: string;
  answer: string;
}

export interface StructuredResponse {
  type: string;
  title: string;
  summary: string;
  sections: Array<{
    label: string;
    content: string;
  }>;
  contextUsed: string[];
  confidence: number;
  tone: string;
  shouldEscalate: boolean;
}

export async function generateStructured({
  system,
  messages,
  knowledge,
  companyProfile,
}: {
  system: string;
  messages: StructuredMessage[];
  knowledge: StructuredKnowledge[];
  companyProfile?: string | null;
}): Promise<StructuredResponse> {
  try {
    // Build context
    const knowledgeContext = knowledge
      .map((k) => `Q: ${k.question}\nA: ${k.answer}`)
      .join("\n\n");

    const transcript = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const prompt = `
${system}

${companyProfile ? `Company Context:\n${companyProfile}\n\n` : ""}

Relevant Knowledge Base:
${knowledgeContext || "(No FAQs available)"}

Chat Transcript:
${transcript}

---

Provide a structured response in JSON format with the following schema:
{
  "type": "answer" | "clarification" | "escalation",
  "title": "Brief heading for the response",
  "summary": "Main response to the user (conversational, friendly)",
  "sections": [
    {
      "label": "Section name (e.g., 'Answer', 'Details', 'Next Steps')",
      "content": "Section content"
    }
  ],
  "contextUsed": ["List of FAQ IDs or context sources used"],
  "confidence": 0.0 to 1.0,
  "tone": "informative" | "apologetic" | "helpful" | "clarifying",
  "shouldEscalate": true if unable to answer confidently
}
`;

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const parsedResponse = JSON.parse(res.text || "{}");

    // Validate and set defaults
    return {
      type: parsedResponse.type || "answer",
      title: parsedResponse.title || "Response",
      summary: parsedResponse.summary || "I'm here to help!",
      sections: Array.isArray(parsedResponse.sections)
        ? parsedResponse.sections
        : [],
      contextUsed: Array.isArray(parsedResponse.contextUsed)
        ? parsedResponse.contextUsed
        : [],
      confidence:
        typeof parsedResponse.confidence === "number"
          ? parsedResponse.confidence
          : 0.7,
      tone: parsedResponse.tone || "informative",
      shouldEscalate: parsedResponse.shouldEscalate === true,
    };
  } catch (error) {
    console.error("Structured generation error:", error);

    // Fallback response
    return {
      type: "escalation",
      title: "Technical Difficulty",
      summary:
        "I'm experiencing technical difficulties. Let me connect you with a human agent.",
      sections: [],
      contextUsed: [],
      confidence: 0.2,
      tone: "apologetic",
      shouldEscalate: true,
    };
  }
}
