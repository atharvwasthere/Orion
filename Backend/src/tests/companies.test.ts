import request from 'supertest';
import { createServer } from '../server.js';
import { prisma } from '../config/prisma.js';

describe('Companies API', () => {
  const app = createServer();
  let testCompanyId: string;

  // Clean up test data before and after tests
  beforeEach(async () => {
    // Clean up test data by first deleting related records
    // Delete messages first (they depend on sessions)
    await prisma.message.deleteMany({
      where: {
        session: {
          company: {
            name: {
              startsWith: 'Test Company'
            }
          }
        }
      }
    });
    
    // Delete FAQs
    await prisma.fAQ.deleteMany({
      where: {
        company: {
          name: {
            startsWith: 'Test Company'
          }
        }
      }
    });
    
    // Delete sessions
    await prisma.session.deleteMany({
      where: {
        company: {
          name: {
            startsWith: 'Test Company'
          }
        }
      }
    });
    
    // Finally delete companies
    await prisma.company.deleteMany({
      where: {
        name: {
          startsWith: 'Test Company'
        }
      }
    });
  });

  afterEach(async () => {
    // Clean up test data
    if (testCompanyId) {
      try {
        await prisma.company.delete({
          where: { id: testCompanyId }
        });
      } catch (error) {
        // Company might already be deleted
      }
    }
  });

  describe('POST /api/v1/companies', () => {
    it('should create a new company', async () => {
      const companyData = {
        name: 'Test Company for CRUD'
      };

      const response = await request(app)
        .post('/api/v1/companies')
        .send(companyData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          name: companyData.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      });

      testCompanyId = response.body.data.id;
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/v1/companies')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Company name is required'
        }
      });
    });
  });

  describe('GET /api/v1/companies', () => {
    beforeEach(async () => {
      // Create a test company
      const company = await prisma.company.create({
        data: { name: 'Test Company for GET' }
      });
      testCompanyId = company.id;
    });

    it('should return all companies', async () => {
      const response = await request(app)
        .get('/api/v1/companies')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array)
      });

      expect(response.body.data.length).toBeGreaterThan(0);
      
      const company = response.body.data.find((c: any) => c.id === testCompanyId);
      expect(company).toBeDefined();
      expect(company.name).toBe('Test Company for GET');
    });
  });

  describe('GET /api/v1/companies/:id', () => {
    beforeEach(async () => {
      // Create a test company
      const company = await prisma.company.create({
        data: { name: 'Test Company for GET ID' }
      });
      testCompanyId = company.id;
    });

    it('should return a specific company', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${testCompanyId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: testCompanyId,
          name: 'Test Company for GET ID',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          _count: {
            faqs: expect.any(Number),
            sessions: expect.any(Number)
          }
        }
      });
    });

    it('should return 404 for non-existent company', async () => {
      const fakeId = 'non-existent-id';
      
      const response = await request(app)
        .get(`/api/v1/companies/${fakeId}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Company not found'
        }
      });
    });
  });

  describe('PUT /api/v1/companies/:id', () => {
    beforeEach(async () => {
      // Create a test company
      const company = await prisma.company.create({
        data: { name: 'Test Company for PUT' }
      });
      testCompanyId = company.id;
    });

    it('should update a company', async () => {
      const updatedData = {
        name: 'Updated Test Company'
      };

      const response = await request(app)
        .put(`/api/v1/companies/${testCompanyId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: testCompanyId,
          name: updatedData.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      });
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .put(`/api/v1/companies/${testCompanyId}`)
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Company name is required'
        }
      });
    });

    it('should return 404 for non-existent company', async () => {
      const fakeId = 'non-existent-id';
      
      const response = await request(app)
        .put(`/api/v1/companies/${fakeId}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Company not found'
        }
      });
    });
  });

  describe('DELETE /api/v1/companies/:id', () => {
    beforeEach(async () => {
      // Create a test company
      const company = await prisma.company.create({
        data: { name: 'Test Company for DELETE' }
      });
      testCompanyId = company.id;
    });

    it('should delete a company', async () => {
      const response = await request(app)
        .delete(`/api/v1/companies/${testCompanyId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Company deleted successfully'
      });

      // Verify company was deleted
      const deletedCompany = await prisma.company.findUnique({
        where: { id: testCompanyId }
      });
      expect(deletedCompany).toBeNull();

      testCompanyId = ''; // Clear testCompanyId since it's been deleted
    });

    it('should return 404 for non-existent company', async () => {
      const fakeId = 'non-existent-id';
      
      const response = await request(app)
        .delete(`/api/v1/companies/${fakeId}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Company not found'
        }
      });
    });
  });
});