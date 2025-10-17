import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LLMMessage, LLMKnowledge, LLMResponse } from "../adapter.ts";

export async function geminiLLM({
  messages,
  knowledge,
}: {
  messages: LLMMessage[];
  knowledge: LLMKnowledge[];
}): Promise<LLMResponse> {
  try {
    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash' // Using Gemini 2.5 Flash model
    });

    // Format FAQs for context
    const faqText = knowledge.length > 0
      ? knowledge
        .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
        .join("\n\n")
      : "(no FAQs available)";

    // Build system prompt
    const systemPrompt = [
        "You are Orion — a calm, confident, and experienced customer support assitant.",
        "You speak with natural warmth and professionalism, not like a robot.",
        "speak like a helpful human support agent.",
        "speak to the customer directly, using 'you' and 'your'.",
        "Maintain a cool, conversational tone that feels human and assured.",
        "",
        "Behavioral rules:",
        "- Never repeat yourself or reuse identical phrasing from earlier turns.",
        "- Acknowledge what the customer just said before replying.",
        "- Keep replies concise but complete — 3-5 sentences is ideal.",
        "- If an answer is uncertain, respond gracefully (e.g. 'I can double-check that for you').",
        "- Always ground facts in the company's FAQs below, when relevant.",
        "",
        "Avoid corporate clichés or filler lines — sound like a real person who knows their stuff.",
        "",
        "=== Company FAQs ===",
        faqText,
        "=== End of FAQs ===",
    ].join("\n");


    // Convert messages to Gemini format
    const history = messages
      .filter(m => m.text && m.text.trim() !== "") // Filter empty messages
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    // Start chat with system instruction
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 500,
      },
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I'm Orion, ready to help with customer support using the provided FAQs." }],
        },
        ...history
      ],
    });

    // Get the latest user message
    const lastUserMessage = messages
      .filter(m => m.role === "user")
      .pop();

    if (!lastUserMessage) {
      throw new Error("No user message found");
    }

    // Send message and get response
    const result = await chat.sendMessage(lastUserMessage.text);
    const response = result.response;
    const text = response.text();
    const userText = lastUserMessage.text.toLowerCase();
    const likelyCompanyIntro =
      userText.includes("what does this") ||
      userText.includes("what does the company") ||
      userText.includes("about") ||
      userText.includes("specialize");

    const faqOverlap = knowledge.some(faq => {
      if (!faq.answer) return false;
      const firstWords = faq.answer
        .toLowerCase()
        .replace(/[.,]/g, '')
        .split(/\s+/)
        .slice(0, 10)
        .join(' ');
      return text.toLowerCase().includes(firstWords);
    });





    // Calculate confidence based on response characteristics
    // Gemini doesn't provide confidence scores, so we'll use heuristics
    let confidence = 0.85; // base

    // Adjust confidence based on response patterns
    if (likelyCompanyIntro && faqOverlap) {
      confidence = 0.95; // obvious company intro match
    } else if (faqOverlap) {
      confidence = 0.9;
    } else if (text.toLowerCase().includes("i'm not sure") ||
      text.toLowerCase().includes("i don't know") ||
      text.toLowerCase().includes("unclear")) {
      confidence = 0.3;
    } else if (text.toLowerCase().includes("based on") ||
      text.toLowerCase().includes("according to")) {
      confidence = 0.8;
    }




    // Get token usage if available
    const usage = response.usageMetadata ? {
      total: (response.usageMetadata.promptTokenCount || 0) +
        (response.usageMetadata.candidatesTokenCount || 0)
    } : { total: 0 };

    return {
      text,
      confidence,
      usage,
    };
  } catch (error) {
    console.error("Gemini LLM Error:", error);

    // Fallback response on error
    return {
      text: "I apologize, but I'm experiencing technical difficulties. Please try again or contact human support if the issue persists.",
      confidence: 0.2,
      usage: { total: 0 },
    };
  }
}