import request from 'supertest';
import { createServer } from 'http';
import handler from './route';

describe('/api/features', () => {
  let server: any;
  beforeAll(() => {
    server = createServer((req, res) => handler(req, res));
  });
  afterAll(() => {
    server.close();
  });

  it('should return features array', async () => {
    const res = await request(server).get('/api/features');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('icon');
  });
});