import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client: MongoClient;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || '';
  client = new MongoClient(uri, {});
  await client.connect();
  return client;
};
