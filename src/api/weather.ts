import { Router } from 'express';
import { cache } from '../server';

const router = Router();

router.get('/', async (req, res) => {
  const city = req.query.city as string;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  const cacheKey = `weather-${city}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await fetch(`https://api.visualcrossing.com/weather-api-endpoint?city=${city}&key=${process.env.WEATHER_API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
