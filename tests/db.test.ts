import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB } from '../src/db';

let mongoServer: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  jest.setTimeout(60000); // Increase the Jest timeout to 60 seconds
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  client = await connectDB();
}, 60000); // Increase the timeout to 60 seconds

afterAll(async () => {
  if (client) {
    await client.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 60000); // Increase the timeout to 60 seconds

describe('MongoDB Connection', () => {
  it('should connect to the database', async () => {
    expect(client).toBeTruthy();
    const db = client.db('admin'); // admin is a default database in MongoDB
    const admin = db.admin();
    const info = await admin.serverStatus();
    expect(info.ok).toBe(1);
  });
});
