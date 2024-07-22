import request from 'supertest';
import { app } from '../../src/server';

describe('GET /api/weather', () => {
  it('should return weather data for Boston', async () => {
    const response = await request(app).get('/api/weather?city=Boston');
    expect(response.status).toBe(200);
    expect(response.body.resolvedAddress).toContain('Boston');
  });

  it('should return 400 for missing city parameter', async () => {
    const response = await request(app).get('/api/weather');
    expect(response.status).toBe(400);
  });
});
