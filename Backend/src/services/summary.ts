import { prisma } from '../config/prisma.ts';
import { generate } from '../llm/adapter.ts';

/**
 * Generate a concise summary of a support session
 * Uses LLM to analyze conversation history and create summary
 */
export async function generateSessionSummary(sessionId: string): Promise<string> {
  try {
    // Fetch session with all messages
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          where: {
            sender: { in: ['user', 'orion'] } // Exclude system messages from summary
          }
        },
        company: {
          select: { name: true }
        }
      }
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // If no messages, return default summary
    if (session.messages.length === 0) {
      return 'No conversation history available.';
    }

    // Format conversation for LLM
    const conversation = session.messages
      .map(m => `${m.sender === 'user' ? 'Customer' : 'Support'}: ${m.text}`)
      .join('\n');

    // Create summary prompt
    const summaryPrompt = `You are a professional support analyst.
    You are summarizing an ongoing customer support conversation.
    
    Generate a concise 2-3 sentence summary of this customer support conversation.

Focus on:
- Main issue/question raised by customer
- Key actions taken or solutions provided
- Current status (resolved, pending, escalated)

Conversation:
${conversation}

Summary:`;

    // Generate summary using LLM
    const { text: summary } = await generate({
      messages: [
        { role: 'user', text: summaryPrompt }
      ],
      knowledge: []
    });

    // Clean up the summary (remove extra whitespace, ensure it's concise)
    const cleanedSummary = summary
      .trim()
      .replace(/\n+/g, ' ')
      .substring(0, 500); // Max 500 chars

    return cleanedSummary;
  } catch (error) {
    console.error('Summary generation error:', error);
    return 'Failed to generate summary. Please try again later.';
  }
}

/**
 * Check if session should auto-generate summary based on message count
 */
export async function shouldGenerateSummary(sessionId: string): Promise<boolean> {
  const summaryInterval = parseInt(process.env.SUMMARY_INTERVAL ?? '2', 10);
  
  const messageCount = await prisma.message.count({
    where: {
      sessionId,
      sender: { in: ['user', 'orion'] } // Only count actual conversation messages
    }
  });

  // Generate summary every N messages
  return messageCount > 0 && messageCount % summaryInterval === 0;
}

/**
 * Update session with generated summary
 */
export async function updateSessionSummary(sessionId: string): Promise<string> {
  const summary = await generateSessionSummary(sessionId);
  
  await prisma.session.update({
    where: { id: sessionId },
    data: { summary }
  });

  return summary;
}
