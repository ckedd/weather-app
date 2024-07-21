import express from 'express';
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';
import { LRUCache } from 'lru-cache';

// Set up MongoDB connection
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function connectDB() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client.db('weatherApp');
}

const dbPromise = connectDB();

const app = express();
const port = 3000;

// Set up LRU cache
const cache = new LRUCache({
  max: 500,            // maximum number of items in the cache
  ttl: 1000 * 60 * 5   // time to live in ms (5 minutes)
});

// Route to fetch weather data
app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'Boston';
  const cacheKey = `weather-${city}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const apiKey = 'YOUR_API_KEY';  // Replace with your actual API key
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();

    // Log request to MongoDB
    const db = await dbPromise;
    const logs = db.collection('logs');
    await logs.insertOne({ city, timestamp: new Date(), weather: data });

    // Cache the result
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Route to get the most popular locations
app.get('/api/usage/most-popular-locations', async (req, res) => {
  try {
    const db = await dbPromise;
    const logs = db.collection('logs');
    const popularLocations = await logs.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();
    res.json(popularLocations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

// Route to get user activity by time of day
app.get('/api/usage/activity-by-time', async (req, res) => {
  try {
    const db = await dbPromise;
    const logs = db.collection('logs');
    const activityByTime = await logs.aggregate([
      {
        $project: {
          hour: { $hour: '$timestamp' }
        }
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    res.json(activityByTime);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
