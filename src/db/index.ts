import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI as string, {});

let db: Db;

client.connect()
  .then(() => {
    db = client.db('weatherApp');
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB', error);
  });

export { db, client };
