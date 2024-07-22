import request from 'supertest';
import { app, startServer } from '../../src/server';
import fetchMock from 'jest-fetch-mock';
import { Server } from 'http';

let server: Server;

beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  server = startServer(3001); // Use a different port for testing
});

afterEach(() => {
  server.close();
  fetchMock.resetMocks();
});

describe('GET /api/weather', () => {
  it('should return weather data for Boston', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      resolvedAddress: 'Boston, MA',
      currentConditions: {
        temp: 22,
        conditions: 'Clear',
      },
    }));

    const response = await request(app).get('/api/weather?city=Boston');
    expect(response.status).toBe(200);
    expect(response.body.resolvedAddress).toContain('Boston');
  });

  it('should return 400 for missing city parameter', async () => {
    const response = await request(app).get('/api/weather');
    expect(response.status).toBe(400);
  });
});
