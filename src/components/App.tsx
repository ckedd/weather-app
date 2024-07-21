import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('/api/weather?city=Boston')
      .then(response => response.json())
      .then(data => setWeather(data));
  }, []);

  return (
    <div>
      <h1>Weather App</h1>
      {weather ? (
        <div>
          <p>{weather.name}</p>
          <p>{weather.weather[0].description}</p>
          <p>{weather.main.temp} K</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
