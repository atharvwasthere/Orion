import type { LLMMessage, LLMKnowledge, LLMResponse } from "../adapter.ts";

export async function mockLLM({
  messages,
  knowledge,
}: {
  messages: LLMMessage[];
  knowledge: LLMKnowledge[];
}): Promise<LLMResponse> {
  // Mock responses for testing
  const mockResponses = [
    "Thank you for reaching out. I understand your concern and I'm here to help.",
    "Based on our FAQs, I can assist you with this issue.",
    "I've reviewed your request. Let me provide you with the information you need.",
    "I appreciate your patience. Here's what I found regarding your inquiry.",
    "Thank you for contacting support. I'll do my best to resolve this for you.",
  ];

  // Get last user message
  const lastUserMessage = messages
    .filter(m => m.role === "user")
    .pop();

  if (!lastUserMessage) {
    return {
      text: "I'm here to help. Please let me know what you need assistance with.",
      confidence: 0.8,
      usage: { total: 0 },
    };
  }

  // Check if any FAQ matches the user's question (simple keyword matching)
  let selectedResponse: string = mockResponses[Math.floor(Math.random() * mockResponses.length)]!;
  let confidence = 0.6; // Default mock confidence

  if (knowledge.length > 0) {
    const userText = lastUserMessage.text.toLowerCase();
    const matchingFaq = knowledge.find(faq => 
      userText.includes(faq.question.toLowerCase().substring(0, 20)) ||
      faq.question.toLowerCase().includes(userText.substring(0, 20))
    );

    if (matchingFaq) {
      selectedResponse = `Based on our FAQs: ${matchingFaq.answer}`;
      confidence = 0.85;
    }
  }

  // Simulate low confidence for certain keywords
  const lowConfidenceKeywords = ['urgent', 'critical', 'legal', 'refund', 'complaint'];
  if (lowConfidenceKeywords.some(keyword => 
    lastUserMessage.text.toLowerCase().includes(keyword))) {
    confidence = 0.35;
    selectedResponse = "This seems like an important issue that may require human assistance. " + selectedResponse;
  }

  // Simulate delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    text: selectedResponse,
    confidence,
    usage: { total: 0 }, // Mock provider doesn't use tokens
  };
}