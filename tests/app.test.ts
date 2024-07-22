import request from 'supertest';
import { app, startServer } from '../src/server';
import { Server } from 'http';

let server: Server;

beforeEach(() => {
  server = startServer(3002); // Use a different port for testing
});

afterEach(() => {
  server.close();
});

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
