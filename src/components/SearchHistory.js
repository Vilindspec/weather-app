
// SearchHistory.js
import React, { useState, useEffect } from 'react';

function SearchHistory({ onSelect }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(stored);
  }, []);

  const handleSelect = (city) => {
    onSelect(city);
  };

  const addToHistory = (city) => {
    const stored = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!stored.includes(city)) {
      stored.push(city);
      localStorage.setItem('searchHistory', JSON.stringify(stored));
    }
  };

  return (
    <div>
      <h3>Search History</h3>
      <ul>
        {history.map((city, index) => (
          <li key={index}>
            <button onClick={() => handleSelect(city)}>{city}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchHistory;