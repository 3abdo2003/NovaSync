import request from 'supertest';
import { createServer } from 'http';
import handler from './route';

describe('/api/testimonials', () => {
  let server: any;
  beforeAll(() => {
    server = createServer((req, res) => handler(req, res));
  });
  afterAll(() => {
    server.close();
  });

  it('should return testimonials array', async () => {
    const res = await request(server).get('/api/testimonials');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('quote');
  });
});