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
      "You are Orion, a helpful and concise customer support assistant.",
      "Your responses should be professional, empathetic, and to the point.",
      "Use the company's FAQs below to ground your answers when relevant:",
      "",
      "=== Company FAQs ===",
      faqText,
      "=== End of FAQs ===",
      "",
      "Instructions:",
      "1. Always try to help based on the FAQs first",
      "2. Be concise but thorough",
      "3. If you're unsure, acknowledge it and suggest escalation to human support",
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

    // Calculate confidence based on response characteristics
    // Gemini doesn't provide confidence scores, so we'll use heuristics
    let confidence = 0.7; // Base confidence

    // Adjust confidence based on response patterns
    if (text.toLowerCase().includes("i'm not sure") || 
        text.toLowerCase().includes("i don't know") ||
        text.toLowerCase().includes("unclear")) {
      confidence = 0.3;
    } else if (knowledge.length > 0 && 
               knowledge.some(faq => 
                 text.toLowerCase().includes(faq.answer.toLowerCase().substring(0, 20)))) {
      // Higher confidence if response references FAQ content
      confidence = 0.9;
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