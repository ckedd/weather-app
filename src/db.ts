import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function connectDB() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client.db('weatherApp');
}

export default connectDB;
