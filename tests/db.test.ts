import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server-global';
import { connectDB } from '../src/db';

let mongoServer: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  client = new MongoClient(uri);
  await client.connect();
}, 30000); // Increase timeout to 30 seconds

afterAll(async () => {
  if (client) {
    await client.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

it('should connect to the database', async () => {
  const db = client.db('weatherApp');
  const collections = await db.listCollections().toArray();
  expect(collections).toBeDefined();
});
