import express from 'express';
const fetch = require('node-fetch'); // Use CommonJS require syntax for node-fetch
import { MongoClient, Db } from 'mongodb';
import { LRUCache } from 'lru-cache';
import dotenv from 'dotenv';
import { connectDB } from './db';

dotenv.config();

let db: Db;

connectDB().then(client => {
  db = client.db('weatherApp');
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Failed to connect to MongoDB', error);
});

const app = express();
const port = 3000;

interface WeatherData {
  resolvedAddress: string;
  currentConditions: {
    temp: number;
    conditions: string;
  };
  [key: string]: any;
}

const cache = new LRUCache<string, WeatherData>({
  max: 500,
  ttl: 1000 * 60 * 5,
});

app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'Boston';
  const cacheKey = `weather-${city}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const apiKey = process.env.VISUAL_CROSSING_API_KEY;
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`
    );
    const data: unknown = await response.json();

    if (typeof data === 'object' && data !== null && 'resolvedAddress' in data && 'currentConditions' in data) {
      const weatherData = data as WeatherData;

      if (db) {
        const logs = db.collection('logs');
        await logs.insertOne({ city, timestamp: new Date(), weather: weatherData });
      }

      cache.set(cacheKey, weatherData);
      res.json(weatherData);
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app, connectDB };
