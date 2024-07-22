// tests/api/weather.test.ts
import request from 'supertest';
import { app, startServer, stopServer } from '../../src/server';
import fetchMock from 'jest-fetch-mock';

beforeAll(() => {
  startServer();
});

afterAll(() => {
  stopServer();
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
