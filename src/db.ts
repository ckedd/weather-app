import { MongoClient, Db } from 'mongodb';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

export async function connectDB(): Promise<MongoClient> {
  await client.connect();
  console.log('Connected to MongoDB');
  return client;
}
