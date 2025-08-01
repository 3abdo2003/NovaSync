import request from 'supertest';
import { createServer } from 'http';
import handler from './route';

describe('/api/subscribe', () => {
  let server: any;
  beforeAll(() => {
    server = createServer((req, res) => handler(req, res));
  });
  afterAll(() => {
    server.close();
  });

  it('should reject invalid email', async () => {
    const res = await request(server)
      .post('/api/subscribe')
      .send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('should accept valid email', async () => {
    const res = await request(server)
      .post('/api/subscribe')
      .send({ email: 'test@example.com' });
    expect([200, 409]).toContain(res.status); // 409 if already exists
  });
});