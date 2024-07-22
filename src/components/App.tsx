import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import '../styles/App.css'; // Adjust the path if necessary

const App: React.FC = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('/api/weather?city=Boston')
      .then(response => response.json())
      .then(data => setWeather(data));
  }, []);

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Weather App
      </Typography>
      {weather ? (
        <Card>
          <CardContent>
            <Typography variant="h4">{weather.resolvedAddress}</Typography>
            <Typography variant="h6">{weather.currentConditions.conditions}</Typography>
            <Typography variant="h6">{weather.currentConditions.temp}°C</Typography>
          </CardContent>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default App;
