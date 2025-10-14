import request from 'supertest';
import { createServer } from '../server';
import { prisma } from '../config/prisma';

describe('Phase 2 API Contract Compliance', () => {
  const app = createServer();
  let companyId: string;
  let sessionId: string;
  let faqId: string;
  let messageId: string;

  // Setup: Create test company
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.message.deleteMany({
      where: {
        session: {
          company: {
            name: 'Phase2 Test Company'
          }
        }
      }
    });
    
    await prisma.fAQ.deleteMany({
      where: {
        company: {
          name: 'Phase2 Test Company'
        }
      }
    });
    
    await prisma.session.deleteMany({
      where: {
        company: {
          name: 'Phase2 Test Company'
        }
      }
    });
    
    await prisma.company.deleteMany({
      where: {
        name: 'Phase2 Test Company'
      }
    });

    // Create test company
    const company = await prisma.company.create({
      data: { name: 'Phase2 Test Company' }
    });
    companyId = company.id;
  });

  // Cleanup after all tests
  afterAll(async () => {
    // Clean up test data
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

  describe('1. Companies Router', () => {
    it('POST /companies - should create and return {id, name, createdAt}', async () => {
      const response = await request(app)
        .post('/api/v1/companies')
        .send({ name: 'Test Company Phase2' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', 'Test Company Phase2');
      expect(response.body.data).toHaveProperty('createdAt');

      // Clean up
      await prisma.company.delete({ where: { id: response.body.data.id } });
    });

    it('GET /companies/:id - should fetch company by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${companyId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(companyId);
      expect(response.body.data.name).toBe('Phase2 Test Company');
    });
  });

  describe('2. FAQs Router', () => {
    it('POST /companies/:companyId/faqs - should create FAQ', async () => {
      const response = await request(app)
        .post(`/api/v1/companies/${companyId}/faqs`)
        .send({
          question: 'What is Phase 2?',
          answer: 'Phase 2 is the CRUD implementation',
          tags: ['phase2', 'test']
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.question).toBe('What is Phase 2?');
      faqId = response.body.data.id;
    });

    it('GET /companies/:companyId/faqs - should list FAQs', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${companyId}/faqs`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('PUT /companies/:companyId/faqs/:faqId - should update FAQ', async () => {
      const response = await request(app)
        .put(`/api/v1/companies/${companyId}/faqs/${faqId}`)
        .send({
          answer: 'Updated answer for Phase 2'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.answer).toBe('Updated answer for Phase 2');
    });

    it('DELETE /companies/:companyId/faqs/:faqId - should delete FAQ', async () => {
      const response = await request(app)
        .delete(`/api/v1/companies/${companyId}/faqs/${faqId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });
  });

  describe('3. Sessions Router', () => {
    it('POST /companies/:companyId/sessions - should create session', async () => {
      const response = await request(app)
        .post(`/api/v1/companies/${companyId}/sessions`)
        .send({ user: 'testuser@phase2.com' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.user).toBe('testuser@phase2.com');
      expect(response.body.data.status).toBe('active');
      sessionId = response.body.data.id;
    });

    it('GET /companies/:companyId/sessions - should list all sessions', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${companyId}/sessions`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('GET /companies/:companyId/sessions/:sessionId - should get specific session', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${companyId}/sessions/${sessionId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(sessionId);
      expect(response.body.data).toHaveProperty('messages');
    });

    it('PATCH /companies/:companyId/sessions/:sessionId - should update status or escalation reason', async () => {
      const response = await request(app)
        .patch(`/api/v1/companies/${companyId}/sessions/${sessionId}`)
        .send({
          status: 'escalated',
          escalationReason: 'Customer requires advanced support'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('escalated');
      expect(response.body.data.escalationReason).toBe('Customer requires advanced support');
    });
  });

  describe('4. Messages Router (with mock bot)', () => {
    it('GET /sessions/:sessionId/messages - should list messages', async () => {
      const response = await request(app)
        .get(`/api/v1/sessions/${sessionId}/messages`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /sessions/:sessionId/messages - should create message and return mock bot response', async () => {
      const response = await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'user',
          text: 'I need help with my account'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userMessage');
      expect(response.body.data).toHaveProperty('botMessage');
      
      // Verify user message
      expect(response.body.data.userMessage.sender).toBe('user');
      expect(response.body.data.userMessage.text).toBe('I need help with my account');
      
      // Verify mock bot response
      expect(response.body.data.botMessage.sender).toBe('orion');
      expect(response.body.data.botMessage.text).toBeTruthy();
      expect(response.body.data.botMessage.confidence).toBeDefined();
      
      messageId = response.body.data.userMessage.id;
    });

    it('POST /sessions/:sessionId/messages - system message should not trigger bot response', async () => {
      const response = await request(app)
        .post(`/api/v1/sessions/${sessionId}/messages`)
        .send({
          sender: 'system',
          text: 'Session has been escalated'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userMessage');
      expect(response.body.data).not.toHaveProperty('botMessage');
    });
  });

  describe('API Contract Validation', () => {
    it('should follow /api/v1 base path for all endpoints', async () => {
      // Test that all endpoints use /api/v1 prefix
      const endpoints = [
        { method: 'get', path: '/api/v1/health' },
        { method: 'get', path: `/api/v1/companies/${companyId}` },
        { method: 'get', path: `/api/v1/companies/${companyId}/sessions` },
        { method: 'get', path: `/api/v1/sessions/${sessionId}/messages` },
      ];

      for (const endpoint of endpoints) {
        const response = await (request(app) as any)[endpoint.method](endpoint.path);
        expect(response.status).not.toBe(404); // Should not be 404 if route exists
      }
    });

    it('should return consistent response structure', async () => {
      // Test various endpoints for consistent response structure
      const response = await request(app)
        .get(`/api/v1/companies/${companyId}`);

      expect(response.body).toHaveProperty('success');
      expect(typeof response.body.success).toBe('boolean');
      
      if (response.body.success) {
        expect(response.body).toHaveProperty('data');
      } else {
        expect(response.body).toHaveProperty('error');
      }
    });
  });
});