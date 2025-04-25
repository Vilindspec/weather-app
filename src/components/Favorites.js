// Favorites.js
import React, { useState, useEffect } from 'react';

function Favorites({ onSelect }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
  }, []);

  const handleSelect = (city) => {
    onSelect(city);
  };

  return (
    <div>
      <h3>Favorites</h3>
      <ul>
        {favorites.map((city, index) => (
          <li key={index} onClick={() => handleSelect(city)}>
            {city}
          </li>
        ))}
      </ul>
      </div>
  )}
  export default Favorites;