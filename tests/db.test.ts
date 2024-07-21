import { MongoClient, Db } from 'mongodb';
import { connectDB } from '../src/server';

describe('MongoDB Connection', () => {
  let client: MongoClient;
  let db: Db;

  beforeAll(async () => {
    client = await connectDB();
    db = client.db('weatherApp');
  });

  afterAll(async () => {
    await client.close();
  });

  it('should connect to the database', async () => {
    const collections = await db.listCollections().toArray();
    expect(collections).toBeDefined();
  });
});
