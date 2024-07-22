import express from 'express';
import { MongoClient, Db } from 'mongodb';
import { LRUCache } from 'lru-cache';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/weatherApp';
const client = new MongoClient(mongoUri, {});
let db: Db;

client.connect()
  .then(() => {
    db = client.db('weatherApp');
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB', error);
  });

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5 // 5 minutes
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/weather', async (req, res) => {
  const city = req.query.city as string;
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  const cacheKey = `weather_${city}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
    const data = await response.json();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

let server;

export const startServer = () => {
  server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

export const stopServer = () => {
  if (server) {
    server.close();
  }
};

export { app, cache };

// import express from 'express';
// import 'isomorphic-fetch'; // Import isomorphic-fetch
// import { MongoClient, Db } from 'mongodb';
// import { LRUCache } from 'lru-cache';
// import dotenv from 'dotenv';
// import { connectDB } from './db';
// import { Server } from 'http';

// dotenv.config();

// let db: Db;

// connectDB().then(client => {
//   db = client.db('weatherApp');
// }).catch(error => {
//   console.error('Failed to connect to MongoDB', error);
// });

// const app = express();

// // Define the type for the weather data
// interface WeatherData {
//   resolvedAddress: string;
//   currentConditions: {
//     temp: number;
//     conditions: string;
//   };
//   [key: string]: any; // Allow additional properties
// }

// // Set up LRU cache
// const cache = new LRUCache<string, WeatherData>({
//   max: 500,
//   ttl: 1000 * 60 * 5,
// });

// // Add a root route
// app.get('/', (req, res) => {
//   res.status(200).send('Root route is working');
// });

// // Route to fetch weather data from Visual Crossing
// app.get('/api/weather', async (req, res) => {
//   const city = req.query.city;
//   if (!city) {
//     return res.status(400).json({ error: 'City parameter is required' });
//   }
//   const cacheKey = `weather-${city}`;

//   if (cache.has(cacheKey)) {
//     return res.json(cache.get(cacheKey));
//   }

//   try {
//     const apiKey = process.env.VISUAL_CROSSING_API_KEY;
//     const response = await fetch(
//       `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`
//     );
//     const data: unknown = await response.json();

//     // Validate the response structure
//     if (typeof data === 'object' && data !== null && 'resolvedAddress' in data && 'currentConditions' in data) {
//       const weatherData = data as WeatherData;

//       // Log request to MongoDB
//       if (db) {
//         const logs = db.collection('logs');
//         await logs.insertOne({ city, timestamp: new Date(), weather: weatherData });
//       }

//       // Cache the result
//       cache.set(cacheKey, weatherData);
//       res.json(weatherData);
//     } else {
//       throw new Error('Invalid response structure');
//     }
//   } catch (error) {
//     console.error('Failed to fetch weather data:', error);
//     res.status(500).json({ error: 'Failed to fetch weather data' });
//   }
// });

// function startServer(port: number): Server {
//   const server = app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//   });
//   return server;
// }

// export { app, startServer, connectDB };
