import request from 'supertest';
import { createServer } from '../server.ts';

describe('Health Endpoint', () => {
  const app = createServer();

  describe('GET /api/v1/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'OK',
        message: 'Orion backend is running',
        timestamp: expect.any(String),
        uptime: expect.any(Number)
      });

      // Verify timestamp is valid ISO string
      expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
      
      // Verify uptime is positive
      expect(response.body.uptime).toBeGreaterThan(0);
    });

    it('should have correct content type', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
    });

    it('should have CORS headers', async () => {
      const response = await request(app)
        .get('/api/v1/health');

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });
});