import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  client = new MongoClient(uri, {});

  await client.connect();
});

afterAll(async () => {
  if (client) {
    await client.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

test('should connect to the database', async () => {
  const db = client.db('test');
  const collection = db.collection('test-collection');
  const result = await collection.insertOne({ name: 'Test' });

  expect(result.insertedId).toBeDefined();
});
