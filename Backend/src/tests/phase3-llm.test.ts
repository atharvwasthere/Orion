import request from 'supertest';
import { createServer } from '../server';
import { prisma } from '../config/prisma';

describe('Phase 3 - LLM Orchestration & Escalation', () => {
  const app = createServer();
  let companyId: string;
  let sessionId: string;
  let faqId: string;

  // Setup: Create test data
  beforeAll(async () => {
    // Clean up existing test data
    await prisma.message.deleteMany({
      where: {
        session: {
          company: {
            name: 'LLM Test Company'
          }
        }
      }
    });
    
    await prisma.fAQ.deleteMany({
      where: {
        company: {
          name: 'LLM Test Company'
        }
      }
    });
    
    await prisma.session.deleteMany({
      where: {
        company: {
          name: 'LLM Test Company'
        }
      }
    });
    
    await prisma.company.deleteMany({
      where: {
        name: 'LLM Test Company'
      }
    });

    // Create test company
    const company = await prisma.company.create({
      data: { name: 'LLM Test Company' }
    });
    companyId = company.id;

    // Create FAQs for knowledge base
    const faq = await prisma.fAQ.create({
      data: {
        companyId,
        question: "How do I reset my password?",
        answer: "To reset your password, click on 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your inbox.",
        tags: ["password", "account", "login"]
      }
    });
    faqId = faq.id;

    await prisma.fAQ.create({
      data: {
        companyId,
        question: "What are your business hours?",
        answer: "Our customer support is available Monday through Friday, 9 AM to 6 PM EST. For urgent issues, our emergency hotline is available 24/7.",
        tags: ["hours", "support", "contact"]
      }
    });

    // Create test session
    const session = await prisma.session.create({
      data: {
        companyId,
        user: "llm-test@example.com",
        status: "active"
      }
    });
    sessionId = session.id;
  });

  // Cleanup after all tests
  afterAll(async () => {
    if (companyId) {
      await prisma.message.deleteMany({
        where: {
          session: {
            companyId
          }
        }
      });
      
      await prisma.fAQ.deleteMany({
        where: { companyId }
      });
      
      await prisma.session.deleteMany({
        where: { companyId }
      });
      
      await prisma.company.delete({
        where: { id: companyId }
      }).catch(() => {});
    }
  });

  describe('LLM-Powered Messages', () => {
    it('should generate intelligent response using LLM when user sends a message', async () => {
      const response = await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'user',
          text: 'How can I reset my password?'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userMessageId');
      expect(response.body.data).toHaveProperty('botMessageId');
      expect(response.body.data).toHaveProperty('reply');
      expect(response.body.data).toHaveProperty('confidence');
      
      // Bot should provide a helpful response
      expect(response.body.data.reply).toBeTruthy();
      expect(typeof response.body.data.confidence).toBe('number');
      
      // Should not escalate for FAQ-based questions (high confidence)
      expect(response.body.data.shouldEscalate).toBe(false);
      
      console.log('Bot response:', response.body.data.reply);
      console.log('Confidence:', response.body.data.confidence);
    });

    it('should use FAQ knowledge base to ground responses', async () => {
      const response = await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'user',
          text: 'What are your support hours?'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      
      // Response should reference FAQ content about business hours
      const reply = response.body.data.reply.toLowerCase();
      expect(
        reply.includes('monday') || 
        reply.includes('friday') || 
        reply.includes('support') ||
        reply.includes('hours') ||
        reply.includes('available')
      ).toBeTruthy();
    });

    it('should maintain conversation context across messages', async () => {
      // First message
      await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'user',
          text: 'I need help with my account'
        })
        .expect(201);

      // Second message with context
      const response = await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'user',
          text: 'Specifically, I forgot my login credentials'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      // Bot should understand context from previous messages
      expect(response.body.data.reply).toBeTruthy();
    });

    it('should not generate bot response for system messages', async () => {
      const response = await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'system',
          text: 'Session started'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userMessageId');
      expect(response.body.data).not.toHaveProperty('botMessageId');
      expect(response.body.data).not.toHaveProperty('reply');
    });
  });

  describe('Escalation Logic', () => {
    it('should escalate session when confidence is below threshold', async () => {
      // Create a new session for escalation test
      const escalationSession = await prisma.session.create({
        data: {
          companyId,
          user: "escalation-test@example.com",
          status: "active"
        }
      });

      // Send a complex/unclear message that should trigger low confidence
      const response = await request(app)
        .post(`/api/v1/sessions/${escalationSession.id}/messages`)
        .send({
          sender: 'user',
          text: 'I have a legal complaint about data breach and need immediate compensation for damages'
        })
        .expect(201);

      // Check if escalation was triggered based on confidence
      const updatedSession = await prisma.session.findUnique({
        where: { id: escalationSession.id }
      });

      // If confidence is low (< 0.4), session should be escalated
      if (response.body.data.confidence < 0.4) {
        expect(response.body.data.shouldEscalate).toBe(true);
        expect(updatedSession?.status).toBe('escalated');
        expect(updatedSession?.escalationReason).toContain('Low confidence');
        
        // Check for system message about escalation
        const messages = await prisma.message.findMany({
          where: { 
            sessionId: escalationSession.id,
            sender: 'system'
          }
        });
        expect(messages.length).toBeGreaterThan(0);
        expect(messages[0]?.text).toContain('escalated');
      } else {
        expect(response.body.data.shouldEscalate).toBe(false);
      }

      // Cleanup
      await prisma.message.deleteMany({
        where: { sessionId: escalationSession.id }
      });
      await prisma.session.delete({
        where: { id: escalationSession.id }
      });
    });
  });

  describe('Provider Switching', () => {
    it('should work with mock provider when LLM_PROVIDER is set to mock', async () => {
      // Temporarily switch to mock provider
      const originalProvider = process.env.LLM_PROVIDER;
      process.env.LLM_PROVIDER = 'mock';

      const response = await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'user',
          text: 'Test message for mock provider'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('reply');
      
      // Restore original provider
      process.env.LLM_PROVIDER = originalProvider;
    });
  });

  describe('Error Handling', () => {
    it('should handle LLM errors gracefully', async () => {
      // Test with invalid API key
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'invalid-key';

      const response = await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'user',
          text: 'Test message with invalid API key'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      // Should still get a fallback response
      expect(response.body.data.reply).toContain('technical difficulties');
      expect(response.body.data.confidence).toBeLessThan(0.3);

      // Restore original key
      process.env.GEMINI_API_KEY = originalKey;
    });
  });
});