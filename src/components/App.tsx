import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState<string>('Boston');

  useEffect(() => {
    fetch(`/api/weather?city=${city}`)
      .then(response => response.json())
      .then(data => setWeather(data));
  }, [city]);

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city" />
      {weather ? (
        <div>
          <h2>{weather.resolvedAddress}</h2>
          <p>Temperature: {weather.currentConditions.temp} °C</p>
          <p>Condition: {weather.currentConditions.conditions}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
