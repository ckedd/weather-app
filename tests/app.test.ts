import request from 'supertest';
import { app } from '../src/server';

describe('Application', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });

  it('should return 200 for root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
