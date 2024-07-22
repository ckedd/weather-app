import { MongoClient } from 'mongodb';
import { connectDB } from '../src/db';

describe('MongoDB Connection', () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await connectDB();
  }, 20000); // Increase timeout to 20 seconds

  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });

  it('should connect to the database', async () => {
    const db = client.db('weatherApp');
    const collections = await db.listCollections().toArray();
    expect(collections).toBeDefined();
  });
});
